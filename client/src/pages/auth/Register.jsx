import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, X, Eye, EyeOff } from "lucide-react";
import { registerUser } from "../../api/auth.api";
import { toastError, toastSuccess } from "../../utils/toast";

const Register = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const emailRegex =
    /^[a-zA-Z][a-zA-Z0-9._%+-]{2,}@[a-z0-9.-]+\.[a-z]{2,}$/;

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  const fullNameRegex = /^[A-Za-z ]{3,30}$/;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let err = {};

    if (!form.name.trim()) {
      err.name = "Full name is required";
    }

    if(!fullNameRegex.test(form.name)){
      err.name=`"${form.name}" can't contain special character`
    }

    if (!emailRegex.test(form.email)) {
      err.email = `"${form.email}" is not a valid email address`;
    }

    if (!passwordRegex.test(form.password)) {
      err.password =
        "Password must contain 1 capital letter, 1 number, 1 special character and minimum 8 characters";
    }

    if (form.password !== form.confirmPassword) {
      err.confirmPassword = "Passwords do not match";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await registerUser(form);
      toastSuccess("Account created successfully");
      navigate("/login");
    } catch (err) {
      toastError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BLUR BACKGROUND */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-indigo-100"></div>

      {/* MODAL */}
      <form
        onSubmit={handleSubmit}
        className="relative bg-white w-full max-w-md p-8 rounded-2xl shadow-xl mx-4"
      >
        {/* CLOSE */}
        <Link to="/" className="absolute right-3 top-3 text-gray-400">
          <X />
        </Link>

        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        {/* FULL NAME */}
        <label className="block text-sm font-medium mb-1">Full Name</label>

        <div className="relative">
          <User className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            name="name"
            placeholder="Enter your full name"
            onChange={handleChange}
            className="w-full pl-10 px-4 py-2.5 border border-gray-300 rounded-lg text-sm
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>

        {errors.name && (
          <p className="text-red-500 font-bold text-xs mt-1">{errors.name}</p>
        )}

        {/* EMAIL */}
        <label className="block text-sm font-medium mt-4 mb-1">
          Email Address
        </label>

        <div className="relative">
          <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            name="email"
            placeholder="Enter your email address"
            onChange={handleChange}
            className="w-full pl-10 px-4 py-2.5 border border-gray-300 rounded-lg text-sm
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>

        {errors.email && (
          <p className="text-red-500 text-xs font-bold mt-1">{errors.email}</p>
        )}

        {/* PASSWORD */}
        <label className="block text-sm font-medium mt-4 mb-1">Password</label>

        <div className="relative">
          <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type={show ? "text" : "password"}
            name="password"
            placeholder="Create a strong password"
            onChange={handleChange}
            className="w-full pl-10 px-4 py-2.5 border border-gray-300 rounded-lg text-sm
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
          <span
            onClick={() => setShow(!show)}
            className="absolute right-3 top-3 cursor-pointer text-gray-500"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        {errors.password && (
          <p className="text-red-500 font-bold text-xs mt-1">{errors.password}</p>
        )}

        {/* CONFIRM PASSWORD */}
        <label className="block text-sm font-medium mt-4 mb-1">
          Confirm Password
        </label>

        <div className="relative">
          <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            placeholder="Re-enter your password"
            onChange={handleChange}
            className="w-full pl-10 px-4 py-2.5 border border-gray-300 rounded-lg text-sm
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
          <span
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-3 cursor-pointer text-gray-500"
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        {errors.confirmPassword && (
          <p className="text-red-500 font-bold text-xs mt-1">{errors.confirmPassword}</p>
        )}

        <button
          className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700
          text-white py-2.5 rounded-lg font-medium transition cursor-pointer"
        >
          Create Account
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
