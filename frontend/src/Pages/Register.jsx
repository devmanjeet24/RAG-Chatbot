import { useForm } from "react-hook-form";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";



export default function Register(){

 const {
   register,
   handleSubmit,
   formState:{ errors }
 } = useForm();

 const navigate = useNavigate();

 const onSubmit = async(data)=>{
   try{
     await API.post("/auth/register",data);
     navigate("/");
   }catch(err){
     alert("Registration failed");
     console.log('Error', err);
   }
 };

 return(
  <div className="auth min-h-screen flex items-center justify-center bg-slate-900">

    <div className="w-full max-w-md bg-slate-200/20 p-8 rounded-2xl shadow-3xl">

    <div className="text-center flex justify-center items-center mb-5">
      <FaRegUserCircle size={80}/>
    </div>

      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Create Account
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

        {/* NAME */}
        <input
          className="w-full p-3 rounded-lg bg-slate-700 text-white outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Name"
          {...register("name",{
            required:"Name is required",
            minLength:{
              value:2,
              message:"Minimum 2 characters"
            }
          })}
        />
        <p className="error text-red-400 text-sm">{errors.name?.message}</p>

        {/* EMAIL */}
        <input
          className="w-full p-3 rounded-lg bg-slate-700 text-white outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Email"
          {...register("email",{
            required:"Email is required",
            pattern:{
              value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message:"Invalid email format"
            }
          })}
        />
        <p className="error text-red-400 text-sm">{errors.email?.message}</p>

        {/* PASSWORD */}
        <input
          type="password"
          className="w-full p-3 rounded-lg bg-slate-700 text-white outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Password"
          {...register("password",{
            required:"Password is required",
            minLength:{
              value:6,
              message:"Password must be at least 6 characters"
            }
          })}
        />
        <p className="error text-red-400 text-sm">{errors.password?.message}</p>

        <button
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold transition"
        >
          Register
        </button>

      </form>
    </div>
  </div>
 );
}