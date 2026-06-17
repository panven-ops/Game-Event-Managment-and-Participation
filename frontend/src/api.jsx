const API_URL = import.meta.env.VITE_API_URL


let accessToken = null

function ParseJWTpayload(token) {
    try {
        const base64 = token.split(".")[1]
        const decoded = atob(base64)
        return JSON.parse(decoded)


    } catch {

        return {}
    }
}

export function isDemo() {
    if (!accessToken) return false
    const payload = ParseJWTpayload(accessToken)
    console.log("JWT payload:", payload)
    return payload.role === "demo"
}

async function tryRefresh() {
    const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include"
    })
    if (!res.ok) return false
    const data = await res.json()
    accessToken = data.access_token
    return true
}


async function authFetch(url, options = {}) {

    const res = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`
        }
    })

    if (res.status !== 401) return res

    const refreshed = await tryRefresh()

    if (!refreshed) {

        window.dispatchEvent(new Event("auth:logout"))

        return res
    }

    return fetch(url, {
        ...options,
        credentials: "include",
        headers: {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`
        }
    })
}


export async function loginAdmin(username, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    if (!res.ok) throw new Error("Invalid credentials")
    const data = await res.json()
    accessToken = data.access_token

    return data
}

export async function logoutAdmin() {
    await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include"
    })
    accessToken = null
}


export async function getEventStatusPublic() {
    const res = await fetch(`${API_URL}/event/status`)
    return res.json()
}

export async function screenshotUpload({ username, file }) {
    const formData = new FormData()
    formData.append("username", username)
    formData.append("file", file)
    const res = await fetch(`${API_URL}/entry/upload`, {
        method: "POST",
        body: formData
    })
    return res.json()
}


export async function getEventStatusAdmin() {
    const res = await authFetch(`${API_URL}/admin/event/status`)
    return res.json()
}

export async function getpendings() {
    const res = await authFetch(`${API_URL}/admin/participants/pendings`)
    return res.json()
}

export async function approveEntry(entryId) {
    const res = await authFetch(`${API_URL}/admin/entry/${entryId}/approve`, {
        method: "POST"
    })
    return res.json()
}

export async function rejectEntry(entryId) {
    const res = await authFetch(`${API_URL}/admin/entry/${entryId}/reject`, {
        method: "POST"
    })
    return res.json()
}

export async function get_participants_list() {
    const res = await authFetch(`${API_URL}/admin/participants`)
    return res.json()
}

export async function startEvent(eventId) {
    const res = await authFetch(
        `${API_URL}/admin/event/start?event_id=${eventId}`, {
            method: "POST"
        })
    return res.json()
}

export async function stopEvent(eventId) {
    const res = await authFetch(
        `${API_URL}/admin/event/stop?event_id=${eventId}`, {
            method: "POST"
        })
    return res.json()
}

export async function scheduleEvent(eventId, start, end, autoWinner) {
    const res = await authFetch(
        `${API_URL}/admin/event/schedule?event_id=${eventId}&scheduled_start=${start}&scheduled_end=${end}&auto_pick_winner=${autoWinner}`, {
            method: "POST"
        })
    return res.json()
}

export async function selectWinner() {
    const res = await authFetch(`${API_URL}/admin/winner/select`, {
        method: "POST"
    })
    return res.json()
}

export async function createEvent(title) {
    const res = await authFetch(
        `${API_URL}/admin/event/create?title=${encodeURIComponent(title)}`, {
            method: "POST"
        })
    return res.json()
}

export async function tryRefreshOnload() {
    const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include"
    })
    if (!res.ok) return false
    const data = await res.json()
    accessToken = data.access_token
    return true
}
