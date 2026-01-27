import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../api/auth.api";
import { toastSuccess, toastError } from "../../utils/toast";
import { X } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      toastSuccess("Registered successfully");
      navigate("/login");
    } catch (err) {
      toastError(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-100 to-blue-100">
      <form
        onSubmit={handleSubmit}
        className="relative bg-white p-8 rounded-xl shadow w-95"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        <input
          name="name"
          placeholder="Name"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition
   pr-10"
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition
   pr-10 mt-3"
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition
   pr-10 mt-3"
          onChange={handleChange}
        />

        {/* <select name="role" className="input mt-3" onChange={handleChange}>
          <option value="intern">Intern</option>
          <option value="mentor">Mentor</option>
        </select> */}

        <button className="w-full mt-5 bg-indigo-600 text-white py-2 rounded-lg">
          Register
        </button>

        <p className="text-sm text-center mt-4">
          Already have account?{" "}
          <Link to="/login" className="text-indigo-600">
            Login
          </Link>
        </p>

        <span className="absolute top-2 right-2 cursor-pointer">
          <Link to="/">
            {" "}
            <X />
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Register;
