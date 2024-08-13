import React, { useState } from "react";
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import foodImage from "./assets/food.jpg";
import meal from "./assets/meal.png";

function App() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("signin"); // Default mode is "signin"

  // Function to validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Function to handle sign up
  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (username.trim() === "" || email.trim() === "" || password.trim() === "") {
      setMessage("All fields are required.");
      return;
    }
    if (!isValidEmail(email)) {
      setMessage("Please enter a valid email.");
      return;
    }
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      return;
    }

    // Send data to db.json
    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        setMessage("Registration successful!");
        setUsername("");
        setEmail("");
        setPassword("");
      } else {
        setMessage("Error registering user.");
      }
    } catch (error) {
      setMessage("Error connecting to the server.");
    }
  };

  // Function to handle sign in
  const handleSignIn = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (username.trim() === "" || password.trim() === "") {
      setMessage("Username and password are required.");
      return;
    }

    // Check if the user exists in the db.json
    try {
      const response = await fetch("http://localhost:3000/users");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const users = await response.json();
      const userExists = users.some(
        (user) => user.username === username && user.password === password
      );

      if (userExists) {
        setMessage("Login successful!");
        setUsername("");
        setPassword("");
      } else {
        setMessage("Invalid username or password.");
      }
    } catch (error) {
      setMessage("Error connecting to the server.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "signin") {
      handleSignIn(e);
    } else if (mode === "signup") {
      handleSignUp(e);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="image-container">
          <img
            src={foodImage}
            alt="Food illustration"
            className="login-image"
          />
        </div>
        <div className="form-section">
          <div className="header">
            <img src={meal} alt="Meal logo" className="logo" />
            <h1>Welcome to Meal Master</h1>
          </div>
          <div className="form-container">
            <form className="form" onSubmit={handleSubmit}>
              {/* Dynamic header based on mode */}
              <h2>{mode === "signup" ? "Sign Up" : "Sign In"}</h2>

              <div className="form-group">
                <label htmlFor="username">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    id="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </label>
              </div>

              {/* Email field is shown only in signup mode */}
              {mode === "signup" && (
                <div className="form-group">
                  <label htmlFor="email">
                    <i className="fas fa-envelope"></i>
                    <input
                      type="email"
                      id="email"
                      placeholder="Email id"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="password">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
              </div>

              {mode === "signin" && (
                <div className="forgot-password">
                  <a href="#forgot">Lost password? Click here!</a>
                </div>
              )}

              {/* Submit button always present */}
              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-submit"
                >
                  {mode === "signup" ? "Submit" : "Sign In"}
                </button>
              </div>

              <div className="buttons">
                <button
                  type="button"
                  className="btn btn-signin"
                  onClick={() => {
                    setMode("signin");
                    setMessage(""); // Clear message on mode switch
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className="btn btn-signup"
                  onClick={() => {
                    setMode("signup");
                    setMessage(""); // Clear message on mode switch
                  }}
                >
                  Sign Up
                </button>
              </div>

              {message && <p className="message">{message}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
