const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN

export async function getEventStatus () {
    const res = await fetch("http://127.0.0.1:8000/event/status", {
        headers: {
            Authorization: `Bearer ${ADMIN_TOKEN}`
        }
    })

    return res.json()
}
