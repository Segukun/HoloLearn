import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const form = new FormData(e.target);
    const email = form.get("email");
    const password = form.get("password");

    console.log("Usuario:", email);
    console.log("Contraseña:", password);

    if (!email || !password) {
      setStatus("Completa todos los campos");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      //Si la respuesta no es ok
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();
      console.log("POST response:", data);

      setStatus("Usted ingreso correctamente");
      navigate("/");

      e.target.reset();
    } catch (err) {
      console.log(err);
      setStatus("Error: " + err.message);
    }
  };

  return (
    <>
      <form action="" onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Usuario" />
        <input type="password" name="password" placeholder="Contraseña" />
        <button type="submit">Ingresar</button>
      </form>
      {status && <p id="ingresar">{status}</p>}
    </>
  );
}
