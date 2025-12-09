import { useState } from "react";
import { registerUser } from "../../services/auth";
import { useNavigate, Link } from "react-router-dom";

const initialRegisterState = { name: "", email: "", password: "" };

const Register = () => {
  const [registerForm, setRegisterForm] = useState(initialRegisterState);
  const [statusMessage, setStatusMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setStatusMessage("Registering user...");

    try {
      const data = await registerUser(registerForm);
      setStatusMessage(data.msg || "Registered successfully");
      setRegisterForm(initialRegisterState);
      navigate("/login");  
    } catch (error) {
      const message = error.response?.data?.msg || "Registration failed";
      setStatusMessage(message);
    }
  };
    return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">Create Account</h2>
        {statusMessage && <div className="mb-4 p-3 bg-emerald-600 text-white rounded">{statusMessage}</div>}
        <form className="flex flex-col gap-4" onSubmit={handleRegister}>
            <input  
            className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
            placeholder="Full name"
            value={registerForm.name}
            onChange={(event) =>
                setRegisterForm({ ...registerForm, name: event.target.value })          
            }   
            required            
        />
            <input
            type="email"    
            className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
            placeholder="Email"
            value={registerForm.email}
            onChange={(event) =>
                setRegisterForm({ ...registerForm, email: event.target.value })          
            }   
            required            
        />  
            <input
            type="password"    
            className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"  
            placeholder="Password"
            value={registerForm.password}
            onChange={(event) =>        
                setRegisterForm({ ...registerForm, password: event.target.value })          
            }   
            required
        />      
            <button 
            type="submit"
            className="px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"       
        >
            Register
        </button>       
        </form> 

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link className="text-emerald-400 hover:underline" to="/login">
            Log in
          </Link>
        </p>
        </div>
    </div>
  );
};

export default Register;