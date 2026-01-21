import { useState } from "react";
import { useNavigate } from "react-router-dom"

function Register() {
  const navigator = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      setMessage("All fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      setMessage("Please enter a valid email format.");
      return;
    }

    if (password.length < 6 || password.length > 12) {
      setMessage("Password must be between 6 and 12 characters.");
      return;
    }

    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharRegex.test(password)) {
      setMessage("Password must include at least one special character.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

     if (response.ok) {
  setMessage("🎉 Registration successful! Redirecting to login...");

  setFormData({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  setTimeout(() => {
    navigator("/login");
  }, 1500);
}

   else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("❌ Server error. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Create Account</h2>

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

          <input
            style={styles.input}
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <button style={styles.button} type="submit">
            Register
          </button>
        </form>
 <p style={{ textAlign: "center", marginTop: "10px" }}>
  Already have an account?{" "}
  <span
    style={{ color: "#667eea", cursor: "pointer", fontWeight: "600" }}
    onClick={() => navigator("/login")}
  > Login
  </span>
</p>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "380px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  },
  heading: {
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
    fontSize: "14px",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#667eea",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  message: {
    marginTop: "15px",
    textAlign: "center",
    color: "#444",
    fontWeight: "500",
  },
};

export default Register;

// code for if register compeleted than go to login page link