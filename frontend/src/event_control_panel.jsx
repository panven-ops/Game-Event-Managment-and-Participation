import { useEffect, useState } from "react"
import { getEventStatusAdmin, startEvent, stopEvent, createEvent } from "./api"

export default function EventControlPanel() {
  const [event, setEvent] = useState(null)
  const [timeLeft, setTimeLeft] = useState(null)
  const [loading, setLoading] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [creating, setCreating] = useState(false)

  async function loadEvent() {
    const data = await getEventStatusAdmin()
    setEvent(data)
  }

  useEffect(() => {
    loadEvent()
  }, [])

  async function handleCreate() {
    if (!newTitle.trim()) return
    setCreating(true)
    await createEvent(newTitle)
    await loadEvent()
    setNewTitle("")
    setCreating(false)
  }

  async function handleStart() {
    if (!event?.id) return
    setLoading(true)
    await startEvent(event.id)
    await loadEvent()
    setLoading(false)
  }

  async function handleStop() {
    if (!event?.id) return
    setLoading(true)
    await stopEvent(event.id)
    await loadEvent()
    setLoading(false)
  }

  // Live countdown
  useEffect(() => {
    if (!event?.ends_at || !event?.active) return  // ← μόνο αν είναι active ΚΑΙ έχει ends_at

    const endTime = new Date(event.ends_at).getTime()
    const now = new Date().getTime()

    // Αν το ends_at είναι στο παρελθόν, μην ξεκινήσεις countdown
    if (endTime <= now) return

    const interval = setInterval(() => {
      const diff = new Date(event.ends_at).getTime() - new Date().getTime()
      if (diff <= 0) {
        setTimeLeft("ENDED")
        clearInterval(interval)
        loadEvent()  // ← απλώς refresh, όχι stop
        return
      }
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeLeft(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      )
    }, 1000)
    return () => clearInterval(interval)
  }, [event])

  // Auto-refresh κάθε 10 δευτερόλεπτα
  useEffect(() => {
    const interval = setInterval(() => loadEvent(), 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">

      {/* CREATE EVENT — εμφανίζεται μόνο αν δεν υπάρχει event */}
      {(!event || !event.id) && (
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Create Event</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Event title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className="flex-1 border rounded-xl p-3"
            />
            <button
              onClick={handleCreate}
              disabled={creating || !newTitle.trim()}
              className="bg-black text-white px-6 py-3 rounded-xl hover:opacity-90 transition disabled:opacity-40"
            >
              {creating ? "Creating..." : "Create"}
            </button>
          </div>
        </section>
      )}

      {/* EVENT STATUS */}
      {event?.id && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-gray-500 text-sm">Status</h2>
              <p className={`text-2xl font-bold mt-2 ${event.active ? "text-green-600" : "text-red-500"}`}>
                {event.active ? "🟢 ACTIVE" : "🔴 INACTIVE"}
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-gray-500 text-sm">Time Remaining</h2>
              <p className="text-3xl font-bold mt-2 font-mono">{timeLeft ?? "—"}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-gray-500 text-sm">Event</h2>
              <p className="text-xl font-bold mt-2 truncate">{event.title}</p>
            </div>
          </div>

          <section className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-2xl font-bold mb-2">Event Control</h2>
            <p className="text-gray-500 text-sm mb-6">
              Starts: {event.starts_at ?? "—"} &nbsp;·&nbsp; Ends: {event.ends_at ?? "—"}
            </p>
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={handleStart}
                disabled={loading || event.active}
                className="bg-green-600 text-white px-6 py-3 rounded-xl hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ▶ Start Event
              </button>
              <button
                onClick={handleStop}
                disabled={loading || !event.active}
                className="bg-red-600 text-white px-6 py-3 rounded-xl hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ⛔ Stop Event
              </button>
            </div>
          </section>
        </>
      )}

    </div>
  )
}
