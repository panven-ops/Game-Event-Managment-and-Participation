import { useState } from "react"
import { loginAdmin } from "../api"

export default function AdminLogin({ onSuccess }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password.")
      return
    }
    setLoading(true)
    try {
      await loginAdmin(username, password)

      setError("")
      onSuccess()
    } catch {
      setError("Wrong credentials. Try again.")
      setPassword("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div className="w-72 bg-white border border-gray-200 rounded-2xl shadow-lg p-5">
        <p className="text-sm font-medium text-gray-900 mb-0.5">Admin access</p>
        <p className="text-xs text-gray-500 mb-4">Enter your credentials to continue.</p>

        {/*USERNAME*/}
        <input
          type="text"
          value={username}
          onChange={(e) => { setUsername(e.target.value); setError("") }}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          placeholder="Username"
          autoFocus
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-gray-400 mb-2"
        />

        {/* PASSWORD*/}
        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError("") }}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          placeholder="Password"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-gray-400 mb-3"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && (
          <div className="mt-3 px-3 py-2 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
