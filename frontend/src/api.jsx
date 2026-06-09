const API_URL = import.meta.env.VITE_API_URL
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN

export async function getEventStatusPublic() {
    const res = await fetch(`${API_URL}/event/status`)

    return res.json()
}

export async function getEventStatusAdmin () {
    const res = await fetch(`${API_URL}/admin/event/status`, {
        headers: {
            Authorization: `Bearer ${ADMIN_TOKEN}`
        }
    })

    return res.json()
}


export async function screenshotUpload({username, file}) {
    const formData = new FormData()

    formData.append("username", username)
    formData.append("file", file)

    const res = await fetch(`${API_URL}/entry/upload`, {
        method: "POST",
        body: formData
    })

    return res.json()
}


export async function getpendings() {

    const res = await fetch(`${API_URL}/admin/participants/pendings`, {
        headers: {
            Authorization: `Bearer ${ADMIN_TOKEN}`

        }
    })
    return res.json()
}


export async function approveEntry(entryId) {
    const res = await fetch(`${API_URL}/admin/entry/${entryId}/approve`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${ADMIN_TOKEN}`

        }
    })
    return res.json()
}


export async function rejectEntry(entryId) {
    const res = await fetch(`${API_URL}/admin/entry/${entryId}/reject`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${ADMIN_TOKEN}`
        }
    })
    return res.json()
}


export async function get_participants_list() {
    const res = await fetch(`${API_URL}/admin/participants`, {
        headers: {
            Authorization: `Bearer ${ADMIN_TOKEN}`
        }
    })
    return res.json()
}


export async function startEvent(eventId) {

    const res = await fetch(
        `${API_URL}/admin/event/start?event_id=${eventId}`,{
            method: "POST",
            headers: {
                Authorization: `Bearer ${ADMIN_TOKEN}`
            }
        })
    return res.json()
}


export async function stopEvent(eventId) {

    const res = await fetch(
        `${API_URL}/admin/event/stop?event_id=${eventId}`,{
            method: "POST",
            headers: {
                Authorization: `Bearer ${ADMIN_TOKEN}`
            }
        })
    return res.json()
}


export async function scheduleEvent(eventId, start, end, autoWinner) {

  const res = await fetch(
    `${API_URL}/admin/event/schedule?event_id=${eventId}&scheduled_start=${start}&scheduled_end=${end}&auto_pick_winner=${autoWinner}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ADMIN_TOKEN}`
      }
    })
  return res.json()
}


export async function selectWinner() {

  const res = await fetch(
    `${API_URL}/admin/winner/select`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ADMIN_TOKEN}`
      }
    }
  )

  return res.json()
}


export async function createEvent(title) {
  const res = await fetch(
    `${API_URL}/admin/event/create?title=${encodeURIComponent(title)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ADMIN_TOKEN}`
      }
    }
  )
  return res.json()
}
