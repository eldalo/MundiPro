import { Navigate, Route, Routes } from 'react-router'
import { AppLayout } from '@/components/layouts/app-layout'
import { AuthLayout } from '@/components/layouts/auth-layout'
import { ProtectedRoute } from '@/lib/auth/protected-route'
import { GuestRoute } from '@/lib/auth/guest-route'
import { AdminRoute } from '@/lib/auth/admin-route'
import Home from '@/routes/Home'
import Fixtures from '@/routes/Fixtures'
import Standings from '@/routes/Standings'
import Bonus from '@/routes/Bonus'
import Profile from '@/routes/Profile'
import Login from '@/routes/Login'
import AdminMatches from '@/routes/admin/AdminMatches'
import AdminMatchEdit from '@/routes/admin/AdminMatchEdit'

export default function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="fixtures" element={<Fixtures />} />
          <Route path="fixtures/:stage" element={<Fixtures />} />
          <Route path="standings" element={<Standings />} />
          <Route path="bonus" element={<Bonus />} />
          <Route path="profile" element={<Profile />} />
          <Route element={<AdminRoute />}>
            <Route path="admin" element={<Navigate to="/admin/matches" replace />} />
            <Route path="admin/matches" element={<AdminMatches />} />
            <Route path="admin/matches/edit/:id" element={<AdminMatchEdit />} />
            <Route path="admin/matches/:stage" element={<AdminMatches />} />
          </Route>
        </Route>
      </Route>
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
