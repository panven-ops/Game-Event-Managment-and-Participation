import { useEffect, useState } from "react"
import { getpendings, approveEntry, rejectEntry } from "../api"
import ApprovedParticipants from "../approved_participants"


import EventControlPanel from "./EventControlPanel"
import EventSchedulePanel from "./EventSchedulePanel"
import WinnerPanel from "./WinnerPanel"

export default function AdminPage() {

  const [pendings, setPendings] = useState([])
  const [loading, setLoading] = useState(false)

  //dashboard tabs
  const [tab, setTab] = useState("moderation")

  async function loadPendings() {
    const data = await getpendings()
    setPendings(data)
  }

  useEffect(() => {
    loadPendings()
  }, [])

  async function handleApprove(id) {
    setLoading(true)
    await approveEntry(id)
    await loadPendings()
    setLoading(false)
  }

  async function handleReject(id) {
    setLoading(true)
    await rejectEntry(id)
    await loadPendings()
    setLoading(false)
  }

  return (
    <div style={{ padding: "20px" }}>

      <h1>⚙️ Admin Dashboard</h1>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>

        <button onClick={() => setTab("moderation")}>
          Moderation
        </button>

        <button onClick={() => setTab("control")}>
          Event Control
        </button>

        <button onClick={() => setTab("schedule")}>
          Scheduling
        </button>

        <button onClick={() => setTab("winners")}>
          Winners
        </button>

      </div>

      {tab === "moderation" && (
        <>
          <h2>⏳ Pending Entries</h2>

          {pendings.length === 0 && <p>No pending entries</p>}

          {pendings.map((participant) => (
            <div
              key={participant.username}
              style={{
                border: "1px solid #ccc",
                marginBottom: "20px",
                padding: "10px"
              }}
            >

              <h3>{participant.username}</h3>

              {participant.entries.map((entry) => (
                <div key={entry.entry_id}>

                  <img src={entry.url} width="200" />

                  <p>Status: {entry.status}</p>

                  <button onClick={() => handleApprove(entry.entry_id)}>
                    Approve
                  </button>

                  <button onClick={() => handleReject(entry.entry_id)}>
                    Reject
                  </button>

                </div>
              ))}

            </div>
          ))}

          <h2>🏆 Approved Participants</h2>
          <ApprovedParticipants />
        </>
      )}


      {tab === "control" && (
        <EventControlPanel />
      )}

      {tab === "schedule" && (
        <EventSchedulePanel />
      )}

      {tab === "winners" && (
        <WinnerPanel />
      )}

    </div>
  )
}
