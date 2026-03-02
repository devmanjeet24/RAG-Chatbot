import { useForm } from "react-hook-form";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register(){

 const {register,handleSubmit} = useForm();
 const navigate = useNavigate();

 const onSubmit = async(data)=>{
   await API.post("/auth/register",data);
  //  alert("Registered!");
   navigate("/");

 };

 return(
  <div className="auth">
    <h2>Register</h2>

    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name",{required:true})} placeholder="Name"/>
      <input {...register("email",{required:true})} placeholder="Email"/>
      <input type="password"
        {...register("password",{required:true,minLength:6})}
        placeholder="Password"/>
      <button>Register</button>
    </form>
  </div>
 );
}