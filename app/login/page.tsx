"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function LoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async () => {
    if (password === process.env.NEXT_PUBLIC_APP_PASSWORD) {
      document.cookie = `auth=${password}; path=/; max-age=35 * 60;`
      router.push("/")
    } else {
      setError("Incorrect password")
    }
  }

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col">
      {/* Header */}
      <div className="text-center py-6 ">
        <p className="text-blue-800 text-3xl sm:text-4xl font-extrabold">
          Shri Gandhi Inter College, Orai Jalaun Uttar Pradesh
        </p>
        <p className="text italic mt-1 text-black font-bold">"शिक्षार्थ आइये, सेवार्थ जाइये"</p>
        <p className="text text-black font-bold">Station Road Orai Jalaun Uttar Pradesh</p>
        <p className="text text-black font-bold">www.sgicorai.com | Email: sgicorai@gmail.com</p>
        <p className="text text-black font-bold">UDISE: 09351300212 | School Code: 45-1032</p>
      </div>

      {/* Image */}
      <div className="flex justify-center mt-2">
        {/* <Image
          src="/img.jpg"
          alt="Gandiji"
          width={100}
          height={100}
          className="rounded-full border border-gray-300 shadow-sm"
        /> */}
      </div>
      <h1 className="text-black font-bold text-2xl items-center text-center mt-1">Transfer Certificate Management System </h1>

      {/* Login Box */}
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm">
          <h2 className="text-xl font-semibold text-center mb-4 text-blue-800">Admin Login</h2>

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded"
          >
            Login
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center mt-3">{error}</p>
          )}
        </div>
      </div>
    </div>
  )
}
