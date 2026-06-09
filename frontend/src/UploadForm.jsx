import { useState } from "react"
import { screenshotUpload } from "./api"


export default function FormUpload({ event }) {

  const [username, setUsername] = useState("")
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)
  const [loading, setLoading] = useState(false)

  //FILE PICK
  function handleDropzoneClick() {
    const inp = document.createElement("input")
    inp.type = "file"
    inp.accept = "image/jpeg,image/png,image/gif,image/webp"
    inp.onchange = (e) => {
      const selected = e.target.files[0]
      if (!selected) return
      setFile(selected)
      setPreview(URL.createObjectURL(selected))
    }
    inp.click()
  }

  function handleRemove() {
    setFile(null)
    setPreview(null)
  }

  //SUBMIT
  async function handleSubmit() {
    if (!username.trim() || !file) {
      setIsError(true)
      setMessage("Fill in your username and select a screenshot.")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const res = await screenshotUpload({ username: username.trim(), file })

      if (res.error || res.detail) {
        setIsError(true)
        setMessage(res.error || res.detail)
      } else {
        setIsError(false)
        setMessage(res.message || "Entry submitted — we'll review it shortly.")
        setUsername("")
        setFile(null)
        setPreview(null)
      }
    } catch {
      setIsError(true)
      setMessage("Upload failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  //LOCKED STATE
  if (!event?.active) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <div className="bg-white border border-gray-200 rounded-2xl p-10">
          {}
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            No active event
          </h2>
          <p className="text-sm text-gray-500">
            Check back when a giveaway is live.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">

      {/*CARD */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8">

        {/* HEADER */}
        <h1 className="text-2xl font-medium text-gray-900 mb-1">
          {event.title ?? "Enter the giveaway"}
        </h1>
        {}
        <p className="text-sm text-gray-500 mb-6">
          Upload a screenshot to join. One entry per account.
        </p>

        {/*STATUS BADGE*/}
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
          {}
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Event active
          {event.ends_at && (
            <span className="text-green-600 font-normal">
              · ends {new Date(event.ends_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>

        {/*USERNAME FIELD*/}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Username
          </label>
          {}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Your username"
            className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-gray-400"
          />
        </div>

        {/*FILE UPLOAD AREA */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Screenshot
          </label>

          {!preview ? (
            /*DROPZONE*/
            <button
              type="button"
              onClick={handleDropzoneClick}
              className="w-full cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors rounded-xl p-8 text-center"
            >
              <div className="text-2xl text-gray-400 mb-2">↑</div>
              <p className="text-sm text-gray-600 font-medium">Click to choose a file</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF or WEBP</p>
            </button>
          ) : (
            /*PREVIEW*/
            <div className="relative rounded-xl overflow-hidden border border-gray-200">
              <img
                src={preview}
                alt="Preview"
                className="w-full object-cover max-h-56"
              />
              {}
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/*SUBMIT BUTTON*/}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-gray-900 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors"
        >
          {loading ? "Uploading..." : "Submit entry"}
        </button>

        {/*FEEDBACK MESSAGE*/}
        {message && (
          <div
            className={`mt-4 px-4 py-3 rounded-xl text-sm font-medium ${
              isError
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-green-50 text-green-800 border border-green-200"
            }`}
          >
            {message}
          </div>
        )}

      </div>
    </div>
  )
}
