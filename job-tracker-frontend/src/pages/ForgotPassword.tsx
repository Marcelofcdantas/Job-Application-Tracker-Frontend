
import { useState } from "react";
import api from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e:any){
    e.preventDefault();
    try {
      await api.post("/auth/reset/request", { email });
      setMessage("Check your email for reset instructions.");
    } catch (err:any){
      setMessage(err.response?.data?.message || "Error");
    }
  }

  return (
    <div style={{padding:40}}>
      <h2>Forgot Password</h2>

      <form onSubmit={handleSubmit}>
        <input 
          placeholder="Email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
        />
        <button>Send</button>
      </form>

      <p>{message}</p>
    </div>
  );
}
