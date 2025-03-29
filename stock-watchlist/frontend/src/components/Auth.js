import { useState } from "react";
import axios from "axios";

const Auth = ({ setToken, setUserId }) => {
  // State for Signup form
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // State for Login form
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const signup = async () => {
    try {
      await axios.post("http://localhost:8000/signup", {
        username: signupUsername,
        email: signupEmail,
        password: signupPassword,
      });
      alert("User created");
      // Optionally clear signup fields after success
      setSignupUsername("");
      setSignupEmail("");
      setSignupPassword("");
    } catch (error) {
      console.error("Signup Error:", error.message);
      alert("Signup failed: " + error.message);
    }
  };

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:8000/login", {
        username: loginUsername,
        password: loginPassword,
      });
      setToken(res.data.access_token);
      setUserId(res.data.user_id);
     
      setLoginUsername("");
      setLoginPassword("");
    } catch (error) {
      console.error("Login Error:", error.message);
      alert("Login failed: Wrong Username or Password" );
    }
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <input
        value={signupUsername}
        onChange={(e) => setSignupUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        value={signupEmail}
        onChange={(e) => setSignupEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        value={signupPassword}
        onChange={(e) => setSignupPassword(e.target.value)}
        type="password"
        placeholder="Password"
      />
      <button onClick={signup}>Signup</button>

      <h2>Login</h2>
      <input
        value={loginUsername}
        onChange={(e) => setLoginUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
        type="password"
        placeholder="Password"
      />
      <button onClick={login}>Login</button>
    </div>
  );
};

export default Auth;