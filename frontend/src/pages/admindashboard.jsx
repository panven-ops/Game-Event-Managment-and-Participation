import { useEffect, useState, useRef } from "react"
import { getpendings, approveEntry, rejectEntry, isDemo } from "../api"
import ApprovedParticipants from "../approved_participants"
import EventControlPanel from "../event_control_panel"
import EventSchedulePanel from "../event_schedule_panel"
import WinnerPanel from "../winner_selection"

export default function SaaSAdminDashboard({ onLogout }) {
  const [tab, setTab] = useState("moderation")
  const [pendings, setPendings] = useState([])
  const [loading, setLoading] = useState(false)
  const approvedRef = useRef(null)
  const demo = isDemo()

  async function loadPendings() {
    const data = await getpendings()
    setPendings(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    loadPendings()
    const interval = setInterval(loadPendings, 3000)
    return () => clearInterval(interval)
  }, [])

  async function handleApprove(id) {
    setLoading(true)
    await approveEntry(id)
    await loadPendings()
    approvedRef.current?.refresh()
    setLoading(false)
  }

  async function handleReject(id) {
    setLoading(true)
    await rejectEntry(id)
    await loadPendings()
    approvedRef.current?.refresh()
    setLoading(false)
  }

  const totalPending = pendings.reduce(
    (acc, p) => acc + p.entries.length, 0
  )

  const navItems = [
    { id: "moderation", label: "Moderation" },
    { id: "control",    label: "Event Control" },
    { id: "schedule",   label: "Scheduling" },
    { id: "winners",    label: "Winners" },
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* SIDEBAR */}
      <aside className="w-64 bg-black text-white p-6 flex flex-col shrink-0">
        <div>
          <h1 className="text-2xl font-bold">Game Admin</h1>
          <p className="text-sm text-gray-400 mt-1">Event Management System</p>
        </div>

        <nav className="flex flex-col gap-2 mt-8 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`text-left p-3 rounded-xl transition flex items-center justify-between ${
                tab === item.id
                  ? "bg-white text-black font-semibold"
                  : "hover:bg-gray-800 text-white"
              }`}
            >
              <span>{item.label}</span>
              {item.id === "moderation" && totalPending > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-red-500 text-white">
                  {totalPending}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* LOGOUT*/}
        <button
          onClick={onLogout}
          className="mt-auto text-left p-3 rounded-xl hover:bg-gray-800 text-red-400 transition"
        >
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8 overflow-y-auto">

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage events, participants and winners</p>
          </div>
          <div className="bg-white rounded-2xl px-4 py-2 shadow">
            <span className="font-semibold">
              {navItems.find((n) => n.id === tab)?.label}
            </span>
          </div>
        </div>
        {demo && (
          <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl">
            <span className="font-medium">Demo mode</span> — you have read-only access. Destructive actions are disabled.
          </div>
        )}

        {/* MODERATION TAB */}
        {tab === "moderation" && (
          <>
            <section className="bg-white rounded-2xl shadow p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6">
                Pending Moderation
                {totalPending > 0 && (
                  <span className="ml-3 text-sm bg-red-100 text-red-600 px-3 py-1 rounded-full font-medium">
                    {totalPending} pending
                  </span>
                )}
              </h2>

              {pendings.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No pending entries</p>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {pendings.map((participant) =>
                    participant.entries.map((entry) => (
                      <div key={entry.entry_id} className="border rounded-2xl p-4">
                        <img
                          src={entry.url}
                          alt={participant.username}
                          className="rounded-xl mb-4 w-full object-cover"
                        />
                        <h3 className="font-bold text-lg">{participant.username}</h3>
                        <p className="text-sm text-gray-500 mb-4">{entry.status}</p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleApprove(entry.entry_id)}
                            disabled={loading || demo}
                            title={demo ? "Demo mode: this action is disabled" : ""}
                            className="bg-green-600 text-white px-4 py-2 rounded-xl w-full hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(entry.entry_id)}
                            disabled={loading || demo}
                            title={demo ? "Demo mode: this action is disabled" : ""}
                            className="bg-red-600 text-white px-4 py-2 rounded-xl w-full hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </section>

            <ApprovedParticipants ref={approvedRef} />
          </>
        )}

        {tab === "control"  && <EventControlPanel />}
        {tab === "schedule" && <EventSchedulePanel />}
        {tab === "winners"  && <WinnerPanel />}

      </main>
    </div>
  )
}
