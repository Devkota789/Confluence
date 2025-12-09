import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser({ email, password });
      localStorage.setItem("token", data.token);
      setEmail("");
      setPassword("");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };
    return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-slate-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
      {error && <div className="mb-4 p-3 bg-red-600 text-white rounded">{error}</div>}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
            value={email}   
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-lg border border-slate-800 bg-slate-950 text-white outline-none focus:border-emerald-400"
            required
        />
        <input
          type="password"   
            placeholder="Password"  

            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded-lg border border-slate-800 bg-slate-950 text-white outline-none focus:border-emerald-400"
            required
        />
        <button 
            type="submit"
            disabled={loading}
            className="px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
        >
            {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-400">
        New here?{" "}
        <Link className="text-emerald-400 hover:underline" to="/register">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default Login;
