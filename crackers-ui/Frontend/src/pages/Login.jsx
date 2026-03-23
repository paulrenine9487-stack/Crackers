import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

 const handleLogin = async () => {
  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }
  setLoading(true);
  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
    let data = {};
    try {
      data = await res.json(); 
    } catch (err) {
      console.error("Invalid JSON response",err);
    }
    setLoading(false);
    if (!res.ok) {
      alert(data?.message || "Login failed");
      return;
    }

    // ✅ Save token & user
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // ✅ Debug
    console.log("USER:", data.user);

    // ✅ Safe role check
    const role = data?.user?.role?.toLowerCase();

    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/home");
    }

  } catch (err) {
    setLoading(false);
    console.error("LOGIN ERROR:", err);
    alert("Server error. Check backend.");
  }
};
  return (
    <div style={container}>
      <div style={card}>
        <h2 style={{ marginBottom: 20 }}>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={input}
        />

        <button
          onClick={handleLogin}
          style={btn}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={{ marginTop: 15, fontSize: 14 }}>
          Don’t have an account?{" "}
          <Link to="/register" style={{ color: "blue", textDecoration: "none" }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  minHeight: "80vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const card = {
  width: 320,
  padding: 30,
  border: "1px solid #ddd",
  borderRadius: 10,
  textAlign: "center",
  background: "#fff"
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 15,
  borderRadius: 5,
  border: "1px solid #ccc",
  outline: "none"
};

const btn = {
  width: "100%",
  padding: 10,
  background: "#000",
  color: "#fff",
  border: "none",
  borderRadius: 5,
  cursor: "pointer"
};