import { useState } from "react"
import { selectWinner } from "./api"


export default function WinnerPanel() {

  const [winner, setWinner] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handlePickWinner() {
    setLoading(true)
    setError("")
    setWinner(null)

    try {
      const result = await selectWinner()

      if (result.error || result.detail) {
        setError(result.error || result.detail)
      } else {
        setWinner(result.winner)
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow p-6">

        {/*HEADER*/}
        <h2 className="text-2xl font-bold mb-1">Winner selection</h2>
        {}
        <p className="text-sm text-gray-500 mb-8">
          Randomly picks one eligible participant as the winner.{" "}
          <span className="text-amber-600 font-medium">This action cannot be undone.</span>
        </p>

        {/*PICK BUTTON*/}
        <button
          onClick={handlePickWinner}
          disabled={loading}
          className="w-full py-3 bg-gray-900 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors"
        >
          {loading
            ? "Picking..."
            : winner
              ? "Pick again"
              : "Pick winner"
          }
        </button>

        {/*ERROR STATE*/}
        {error && (
          <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 text-red-800 text-sm rounded-xl">
            {error}
          </div>
        )}

        {/*WINNER BOX*/}
        {winner && (
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
            {}
            <div className="text-5xl mb-3">🏆</div>

            {}
            <p className="text-xs font-medium uppercase tracking-widest text-amber-700 mb-2">
              Winner
            </p>

            {}
            <p className="text-3xl font-bold text-gray-900 break-all">
              {winner}
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
