"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import logo from "../public/static/images/logo.png";
import { useAuth } from "@/contexts/AuthContext";
// import api from "@/lib/axios";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      await login({ email, password });
    } catch (err) {
      setError("Invalid credentials");
    }

    // setIsSubmitting(true);

    // try {
    //   const response = await api.post(
    //     `${process.env.NEXT_PUBLIC_BACKEND_URL_API}/login`,
    //     { email, password },
    //     {
    //       headers: { "Content-Type": "application/json" },
    //     }
    //   );

    //   // Save the token and redirect to dashboard
    //   localStorage.setItem("auth_token", response.data.token);
    //   router.push("/dashboard");
    // } catch (err) {
    //   const errorMessage = err.response?.data?.message || "Invalid credentials";
    //   setError(errorMessage);
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  return (
    <div className="flex h-screen items-center justify-center p-10">
      <div className="xl:w-1/2 rounded-2xl border border-white-800 md:shadow-xl">
        <div className="grid grid-cols-3 gap-4 p-5">
          <div className="flex items-center justify-items-center">
            <Image src={logo} alt="Logo" />
          </div>
          <div className="items-center justify-center col-span-2">
            <form onSubmit={handleLogin} autoComplete="off">
              <h1 className="text-center font-extrabold uppercase text-[#FF6B00]">
                Login Panel
              </h1>
              <br />
              <input
                name="email"
                id="email"
                type="text"
                className="mb-3 w-full rounded-2xl outline-rose-400 px-5 py-3 text-gray-950 text-[#692c6c]"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                id="password"
                type="password"
                className="mb-3 w-full rounded-2xl outline-rose-400 px-5 py-3 text-[#692c6c]"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p style={{ color: "red" }}>{error}</p>}
              <button
                type="submit"
                className="mb-3 w-full rounded-2xl bg-rose-500 px-5 py-3 font-semibold bg-[#FF6B00] text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
