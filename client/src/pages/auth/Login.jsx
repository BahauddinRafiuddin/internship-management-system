// import { useNavigate } from "react-router-dom";
// import useAuth from "../../hooks/useAuth";
// import { useState } from "react";
// import { loginUser } from "../../api/auth.api";
// import { toastError, toastSuccess } from "../../utils/toast";
// const Login = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       setLoading(true);

//       const data = await loginUser(form);

//       // save token + user
//       login(data);

//       toastSuccess("Login Successfull");

//       // role-based redirect
//       if (data.user.role === "admin") {
//         navigate("/admin");
//       } else if (data.user.role === "mentor") {
//         navigate("/mentor");
//       } else {
//         navigate("/intern");
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed");
//       toastError(err.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded-lg shadow-md w-96"
//       >
//         <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

//         {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           className="w-full mb-4 px-3 py-2 border rounded"
//           onChange={handleChange}
//           required
//         />

//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           className="w-full mb-4 px-3 py-2 border rounded"
//           onChange={handleChange}
//           required
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { loginUser } from "../../api/auth.api";
import { Eye, EyeOff } from "lucide-react";
import { toastError, toastSuccess } from "../../utils/toast";
import { X } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await loginUser(form);
      login(data);

      toastSuccess("Login successful");

      if (data.user.role === "admin") navigate("/admin");
      else if (data.user.role === "mentor") navigate("/mentor");
      else navigate("/intern");
    } catch (err) {
      toastError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-100 to-blue-100">
      <form
        onSubmit={handleSubmit}
        className="relative bg-white p-8 rounded-2xl shadow-xl w-90"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back 👋</h2>

        <input
          name="email"
          placeholder="Email"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition
   pr-10"
          onChange={handleChange}
          required
        />

        <div className="relative mt-4">
          <input
            type={show ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition
   pr-10"
            onChange={handleChange}
            required
          />

          <span
            onClick={() => setShow(!show)}
            className="absolute right-3 top-3 cursor-pointer text-gray-500"
          >
            {show ? <EyeOff /> : <Eye />}
          </span>
        </div>

        <button
          disabled={loading}
          className="w-full mt-6 bg-indigo-600 text-white py-2 rounded-lg cursor-pointer hover:bg-indigo-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-600 font-medium">
            Register
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

export default Login;
