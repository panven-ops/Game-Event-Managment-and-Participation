import { useEffect, useState } from "react"
import { getEventStatusPublic } from "../api"
import FormUpload from "../UploadForm"


export default function PublicPage() {
  const [event, setEvent] = useState(null)
  const [loadingEvent, setLoadingEvent] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getEventStatusPublic()
      setEvent(data)
      setLoadingEvent(false)
    }
    load()

    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">

      {/*NAVBAR*/}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto h-14 flex items-center justify-between px-6">

          {}
          <span className="text-sm font-medium text-gray-900">
            Raffle
          </span>

          {}
          {!loadingEvent && (
            event?.active ? (
              // ACTIVE
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 text-xs font-medium px-3 py-1.5 rounded-full">
                {}
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Live now
              </div>
            ) : (
              // INACTIVE
              <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-500 text-xs font-medium px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-gray-400" />
                No active event
              </div>
            )
          )}
        </div>
      </nav>

      {/*HERO SECTION*/}
      <div className="max-w-lg mx-auto px-4 pt-12 text-center">
        <h1 className="text-3xl font-medium text-gray-900 leading-snug mb-3">
          {event?.title
            ? `Enter: ${event.title}`
            : "Enter the giveaway"
          }
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-10">
          Upload a screenshot to join. One entry per account.
          Winners are selected randomly from approved entries.
        </p>
      </div>

      {/*FORM*/}
      {loadingEvent ? (
        //SKELETON
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6" />
            <div className="h-10 bg-gray-100 rounded-xl mb-5" />
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
            <div className="h-28 bg-gray-100 rounded-xl mb-6" />
            <div className="h-11 bg-gray-200 rounded-xl" />
          </div>
        </div>
      ) : (
        <FormUpload event={event} />
      )}

      {/*HOW IT WORKS*/}
      <div className="max-w-sm mx-auto px-4 py-12">
        <div className="flex justify-between gap-4">
          {[
            { num: "1", label: "Upload screenshot" },
            { num: "2", label: "Admin reviews" },
            { num: "3", label: "Winner drawn" },
          ].map((step) => (
            <div key={step.num} className="flex-1 text-center">
              {}
              <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 text-xs font-medium flex items-center justify-center mx-auto mb-2">
                {step.num}
              </div>
              <p className="text-xs text-gray-400">{step.label}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
