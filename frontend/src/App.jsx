import { useState, useEffect } from 'react'
import PublicPage from "./pages/publicpage"
import SaaSAdminDashboard from "./pages/admindashboard"
import AdminLogin from "./pages/adminlogin"
import {logoutAdmin, tryRefreshOnload, isDemo} from "./api"

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const isAdminRoute = window.location.search.includes("admin")


  useEffect(() => {
    async function checkAuth() {

      if (isAdminRoute) {
        const ok = await tryRefreshOnload()
        console.log("refresh ok", ok)
        console.log("isDemo", isDemo())
        if (ok) setIsAdmin(true)
      }

      setAuthLoading(false)
    }

    checkAuth()
  }, [])

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

  if (authLoading) return null

  if (isAdmin) return <SaaSAdminDashboard onLogout={handleLogout} />

  return (
    <div>
      <PublicPage />
      {isAdminRoute && <AdminLogin onSuccess={() => setIsAdmin(true)} />}
    </div>
  )
}
