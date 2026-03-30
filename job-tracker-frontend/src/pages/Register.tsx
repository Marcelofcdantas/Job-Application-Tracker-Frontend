
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e:any){
    e.preventDefault();
    await api.post("/auth/register",{email,password});
    navigate("/");
  }

  return (
    <div style={{padding:40}}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" onChange={e=>setPassword(e.target.value)} />
        <button>Create</button>
      </form>
    </div>
  );
}
