import { useEffect, useState, useImperativeHandle, forwardRef } from "react"
import { get_participants_list } from "./api"


//HELPER: Avatar με initials
function getInitials(username) {
  return username?.slice(0, 2).toUpperCase() ?? "??"
}

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-amber-100 text-amber-700",
  "bg-coral-100 text-coral-700",
  "bg-purple-100 text-purple-700",
]

const ApprovedParticipants = forwardRef((props, ref) => {
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)

  async function loadParticipants() {
    setLoading(true)
    const data = await get_participants_list()
    setParticipants(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useImperativeHandle(ref, () => ({
    refresh: loadParticipants,
  }))

  useEffect(() => {
    loadParticipants()
  }, [])

  return (
    <div className="bg-white rounded-2xl shadow p-6">

      {/*HEADER με counter*/}
      <div className="flex items-center gap-3 mb-1">
        <h2 className="text-xl font-bold">Approved participants</h2>
        {}
        {!loading && (
          <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full font-medium">
            {participants.length} total
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Participants with at least one approved entry are eligible for the draw.
      </p>

      {/*LOADING STATE*/}
      {loading && (
        <div className="text-center py-8 text-gray-400 text-sm">
          Loading...
        </div>
      )}

      {/*EMPTY STATE*/}
      {!loading && participants.length === 0 && (
        <div className="text-center py-10 text-gray-400 text-sm">
          No approved participants yet.
        </div>
      )}

      {/*TABLE*/}
      {!loading && participants.length > 0 && (
        <div className="overflow-x-auto">
          {}
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {}
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide pb-3">
                  Username
                </th>
                <th className="text-center text-xs font-medium text-gray-400 uppercase tracking-wide pb-3">
                  Approved
                </th>
                <th className="text-center text-xs font-medium text-gray-400 uppercase tracking-wide pb-3">
                  Overflow
                </th>
                <th className="text-center text-xs font-medium text-gray-400 uppercase tracking-wide pb-3">
                  Eligible
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {}
              {participants.map((p, idx) => (
                <tr key={p.participant_id ?? idx} className="hover:bg-gray-50 transition-colors">

                  {/*USERNAME + AVATAR*/}
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      {}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                        AVATAR_COLORS[idx % AVATAR_COLORS.length]
                      }`}>
                        {getInitials(p.username)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {p.username}
                      </span>
                    </div>
                  </td>

                  {/*APPROVED COUNT*/}
                  <td className="py-3 text-center">
                    {}
                    <span className={`inline-flex items-center justify-center min-w-[24px] h-6 rounded-md text-xs font-medium px-1.5 ${
                      p.approved_count > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {p.approved_count}
                    </span>
                  </td>

                  {/*OVERFLOW COUNT*/}
                  <td className="py-3 text-center">
                    <span className="text-sm text-gray-500">
                      {p.overflow_count}
                    </span>
                  </td>

                  {/*ELIGIBLE BADGE */}
                  <td className="py-3 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      p.eligible
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {p.eligible ? "YES" : "NO"}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  )
})

export default ApprovedParticipants
