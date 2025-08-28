import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-800 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Login to DischargeAI
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
