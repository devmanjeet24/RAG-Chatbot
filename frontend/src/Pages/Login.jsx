import { useForm } from "react-hook-form";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";
import { FaRegUserCircle } from "react-icons/fa";

export default function Login() {

  const {
    register,
    handleSubmit,
    formState:{errors}
  } = useForm();

  const nav = useNavigate();
  const { setUser } = useUser();

  const onSubmit = async(data)=>{
    try{
      const res = await API.post("/auth/login",data);

      // 🔥 TOKEN SAVE
      localStorage.setItem("token",res.data.data.token);

      // 🔥 USER CONTEXT SAVE (IMPORTANT)
      setUser(res.data.data.user);

      nav("/chat");

    }catch(err){
      alert("Login failed");
    }
  };

  return (
    <div className="auth min-h-screen flex items-center justify-center bg-slate-900">

      <div className="w-full max-w-md bg-slate-800 p-8 rounded-2xl shadow-2xl">

            <div className="text-center flex justify-center items-center mb-5">
              <FaRegUserCircle size={80}/>
            </div>

        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

          <input
            className="w-full p-3 rounded-lg bg-slate-700 text-white outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Email"
            {...register("email",{
              required:"Email required"
            })}
          />
          <p className="text-red-400 text-sm">{errors.email?.message}</p>

          <input
            type="password"
            className="w-full p-3 rounded-lg bg-slate-700 text-white outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Password"
            {...register("password",{
              required:"Password required",
              minLength:{
                value:6,
                message:"Minimum 6 characters"
              }
            })}
          />
          <p className="text-red-400 text-sm">{errors.password?.message}</p>

          <button
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold transition"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );
}