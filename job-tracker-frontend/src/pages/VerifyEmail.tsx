
import { useEffect, useState } from "react";
import api from "../services/api";

export default function VerifyEmail(){
  const [message,setMessage] = useState("Verifying...");

  useEffect(()=>{
    const token = new URLSearchParams(window.location.search).get("token");
    if(!token){
      setMessage("Invalid link");
      return;
    }

    api.post("/auth/verify-email",{token})
      .then(()=>setMessage("Email verified"))
      .catch(()=>setMessage("Error verifying"));
  },[]);

  return(
    <div style={{padding:40}}>
      <h2>Email Verification</h2>
      <p>{message}</p>
    </div>
  );
}
