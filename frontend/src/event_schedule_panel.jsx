import { useState, useEffect } from "react"
import { scheduleEvent, getEventStatusAdmin, isDemo } from "./api"


export default function EventSchedulePanel() {

  const [event, setEvent] = useState(null)
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [autoWinner, setAutoWinner] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const demo = isDemo()

  useEffect(() => {
    async function load() {
      const data = await getEventStatusAdmin()
      setEvent(data)
    }
    load()
  }, [])

  async function handleSchedule() {
    if (!event?.id) return
    if (!start || !end) {
      setError("Please fill in both start and end time.")
      return
    }
    if (new Date(end) <= new Date(start)) {
      setError("End time must be after start time.")
      return
    }

    setError("")
    setLoading(true)

    const result = await scheduleEvent(event.id, start, end, autoWinner)
    console.log("SCHEDULE RESULT:", result)

    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 4000)
  }

  //NO EVENT STATE
  if (!event?.id) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">
        No event found. Create an event first.
      </div>
    )
  }

  return (
    <div className="space-y-6">

      <div className="bg-white rounded-2xl shadow p-6">

        {/* HEADER */}
        <h2 className="text-2xl font-bold mb-1">Schedule event</h2>
        <p className="text-sm text-gray-500 mb-6">
          Set when the event starts and ends automatically.
        </p>

        {/*EVENT PILL*/}
        <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full mb-6">
          <span>📅</span>
          {event.title}
        </div>

        {/*DATETIME INPUTS*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            {}
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Start time
            </label>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => {
                setStart(e.target.value)
                setError("")
              }}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              End time
            </label>
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => {
                setEnd(e.target.value)
                setError("")
              }}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        </div>

        {/*AUTO WINNER TOGGLE*/}
        <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer select-none mb-6 hover:bg-gray-100 transition-colors">
          {}
          <input
            type="checkbox"
            checked={autoWinner}
            onChange={(e) => setAutoWinner(e.target.checked)}
            className="sr-only"
          />
          {}
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
            autoWinner
              ? "bg-gray-900 border-gray-900"
              : "bg-white border-gray-300"
          }`}>
            {}
            {autoWinner && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Auto-pick winner</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Automatically select a winner when the event ends
            </p>
          </div>
        </label>

        {/*ERROR MESSAGE*/}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-800 text-sm rounded-xl">
            {error}
          </div>
        )}

        {/*SAVE BUTTON*/}
        <button
          onClick={handleSchedule}
          disabled={loading || demo}
          title={demo ? "Demo mode: this action is disabled" : ""}
          className="w-full py-3 bg-gray-900 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors"
        >
          {loading ? "Saving..." : "Save schedule"}
        </button>

        {/*SUCCESS MESSAGE*/}
        {saved && (
          <div className="mt-4 px-4 py-3 bg-green-50 border border-green-200 text-green-800 text-sm rounded-xl">
            ✓ Schedule saved — starts {new Date(start).toLocaleString()} · ends {new Date(end).toLocaleString()}
          </div>
        )}

      </div>
    </div>
  )
}
