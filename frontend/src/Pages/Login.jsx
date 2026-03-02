import { useForm } from "react-hook-form";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const { register, handleSubmit, formState:{errors} } = useForm();
  const nav = useNavigate();

  const onSubmit = async(data)=>{
    const res = await API.post("/auth/login",data);
    localStorage.setItem("token",res.data.data.token);
    nav("/chat");
  };

  return (
    <div className="auth">
      <h2>Login</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="Email"
          {...register("email",{required:"Email required"})}
        />
        <p>{errors.email?.message}</p>

        <input
          type="password"
          placeholder="Password"
          {...register("password",{required:true,minLength:6})}
        />
        <button>Login</button>
      </form>
    </div>
  );
}