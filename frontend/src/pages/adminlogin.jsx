import { useState } from "react"


const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN

export default function AdminLogin({ onSuccess }) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  function handleLogin() {
    if (!password.trim()) {
      setError("Please enter your admin token.")
      return
    }

    if (password === ADMIN_TOKEN) {
      setError("")
      onSuccess()
    } else {
      setError("Wrong token. Try again.")
      setPassword("")
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">

      {/*CARD*/}
      <div className="w-72 bg-white border border-gray-200 rounded-2xl shadow-lg p-5">

        {/*HEADER*/}
        <p className="text-sm font-medium text-gray-900 mb-0.5">Admin access</p>
        <p className="text-xs text-gray-500 mb-4">Enter your token to continue.</p>

        {/*TOKEN INPUT*/}
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setError("")
          }}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          placeholder="Admin token"
          autoFocus
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-gray-400 mb-3"
        />

        {/*LOGIN BUTTON*/}
        <button
          onClick={handleLogin}
          className="w-full py-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Login
        </button>

        {/*ERROR*/}
        {error && (
          <div className="mt-3 px-3 py-2 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg">
            {error}
          </div>
        )}

      </div>
    </div>
  )
}
