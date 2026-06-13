import { useState, useEffect } from 'react'
import PublicPage from "./pages/publicpage"
import SaaSAdminDashboard from "./pages/admindashboard"
import AdminLogin from "./pages/adminlogin"
import {logoutAdmin} from "./api"

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false)
  const isAdminRoute = window.location.search.includes("admin")

  useEffect(() => {
    function handleAuthLogout() {

      setIsAdmin(false)
    }
    window.addEventListener("auth:logout", handleAuthLogout)
    return () => window.removeEventListener("auth:logout", handleAuthLogout)
  }, [])

  async function handleLogout() {

    await logoutAdmin()
    setIsAdmin(false)
  }

  if (isAdmin) return <SaaSAdminDashboard onLogout={handleLogout} />

  return (
    <div>
      <PublicPage />
      {isAdminRoute && <AdminLogin onSuccess={() => setIsAdmin(true)} />}
    </div>
  )
}
