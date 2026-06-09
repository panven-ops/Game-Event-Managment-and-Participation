import { useState } from 'react'
import PublicPage from "./pages/publicpage"
import SaaSAdminDashboard from "./pages/admindashboard"
import AdminLogin from "./pages/adminlogin"

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false)
  const isAdminRoute = window.location.search.includes("admin")

  if (isAdmin) return <SaaSAdminDashboard onLogout={() => setIsAdmin(false)} />

  return (
    <div>
      <PublicPage />
      {isAdminRoute && <AdminLogin onSuccess={() => setIsAdmin(true)} />}
    </div>
  )
}
