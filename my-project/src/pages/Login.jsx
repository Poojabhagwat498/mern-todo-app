import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const API_URL = import.meta.env.VITE_URL; // http://localhost:5000/api

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const { username, email, password } = formData;

    if (!username || !email || !password) {
      setIsError(true);
      setMessage("All fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      setIsError(true);
      setMessage("Invalid email format.");
      return;
    }

    if (password.length < 6 || password.length > 12) {
      setIsError(true);
      setMessage("Password must be 6–12 characters.");
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setIsError(true);
      setMessage("Password must include a special character.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsError(true);
        setMessage(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);

      setIsError(false);
      setMessage("Login successful!");

      setTimeout(() => navigate("/todos"), 1000);
    } catch (error) {
      setIsError(true);
      setMessage("Server error. Try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />

          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <button style={styles.button} type="submit">
            Login
          </button>
        </form>

        {message && (
          <p
            style={{
              ...styles.message,
              color: isError ? "#e11d48" : "#16a34a",
            }}
          >
            {message}
          </p>
        )}

        <p style={styles.registerText}>
          Don&apos;t have an account?{" "}
          <Link to="/register" style={styles.registerLink}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ✅ STYLES OUTSIDE COMPONENT */
const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },
  message: {
    marginTop: "15px",
    textAlign: "center",
    fontWeight: "500",
  },
  registerText: {
    marginTop: "15px",
    textAlign: "center",
    fontSize: "14px",
    color: "#555",
  },
  registerLink: {
    color: "#6366f1",
    fontWeight: "600",
    textDecoration: "none",
  },
};

export default Login;
