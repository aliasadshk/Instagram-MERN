import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";

const Signup = () => {
  const [name, setName] = useState(''), [email, setEmail] = useState(''), [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email.includes("@") || !email.includes(".")) return toast.error("Invalid email");

    try {
      const res = await fetch("http://localhost:2048/signup", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, dp: undefined }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.err || "Signup failed");

      toast.success(data.msg);
      navigate("/signin");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex flex-col items-center gap-4 bg-white shadow-lg p-8 w-80 rounded-2xl">
        <h2 className="text-4xl font-medium">Instagram</h2>

        <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)}
          className="border py-2 px-4 w-full rounded-md focus:border-blue-500" />

        <input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
          className="border py-2 px-4 w-full rounded-md focus:border-blue-500" />

        <div className="relative w-full">
          <input type={showPassword ? "text" : "password"} placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)} className="border py-2 pr-10 px-4 w-full rounded-md focus:border-blue-500" />
          {showPassword ? <BiSolidHide onClick={() => setShowPassword(false)}
            className="absolute right-3 top-3 cursor-pointer text-xl opacity-60" />
            : <BiSolidShow onClick={() => setShowPassword(true)}
            className="absolute right-3 top-3 cursor-pointer text-xl opacity-60" />}
        </div>

        <button onClick={handleSignup}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 duration-300">Sign up</button>

        <h5 className="text-sm">Already have an account? <Link to="/signin" className="text-blue-500">Sign in</Link></h5>
      </div>
    </div>
  );
};

export default Signup;
