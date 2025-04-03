import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { userContext } from '../../App';
import { BiSolidHide, BiSolidShow } from 'react-icons/bi';

const Signin = () => {
  const [email, setEmail] = useState(''), [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { dispatch } = useContext(userContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email.includes("@") || !email.includes(".")) return toast.error("Invalid email");

    try {
      const res = await fetch('http://localhost:2048/signin', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.err || "Login failed");

      localStorage.setItem("jwt", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      dispatch({ type: 'USER', payload: data.user });

      toast.success("Login Successful");
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex flex-col items-center gap-4 bg-white shadow-lg p-8 w-80 rounded-2xl">
        <h2 className="text-4xl font-medium">Instagram</h2>

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

        <button onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 duration-300">Log in</button>

        <h5 className="text-sm">Don't have an account? <Link to="/signup" className="text-blue-500">Sign up</Link></h5>
      </div>  
    </div>
  );
};

export default Signin;
