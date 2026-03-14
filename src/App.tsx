import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import AppLayout from '@/components/layout/AppLayout'
import LoginPage from '@/features/auth/LoginPage'
import DashboardPage from '@/features/dashboard/DashboardPage'
import OrganizationsPage from '@/features/organizations/OrganizationsPage'
import OrganizationNewPage from '@/features/organizations/OrganizationNewPage'
import OrganizationDetailPage from '@/features/organizations/OrganizationDetailPage'
import SchoolsPage from '@/features/schools/SchoolsPage'
import SchoolNewPage from '@/features/schools/SchoolNewPage'
import SchoolDetailPage from '@/features/schools/SchoolDetailPage'
import SchoolMembersPage from '@/features/schools/SchoolMembersPage'
import SchoolMembersInvitePage from '@/features/schools/SchoolMembersInvitePage'
import UsersPage from '@/features/users/UsersPage'
import UserDetailPage from '@/features/users/UserDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/organizations" element={<OrganizationsPage />} />
              <Route path="/dashboard/organizations/new" element={<OrganizationNewPage />} />
              <Route path="/dashboard/organizations/:organizationId" element={<OrganizationDetailPage />} />
              <Route path="/dashboard/schools" element={<SchoolsPage />} />
              <Route path="/dashboard/schools/new" element={<SchoolNewPage />} />
              <Route path="/dashboard/schools/:schoolId" element={<SchoolDetailPage />} />
              <Route path="/dashboard/schools/:schoolId/members" element={<SchoolMembersPage />} />
              <Route path="/dashboard/schools/:schoolId/members/invite" element={<SchoolMembersInvitePage />} />
              <Route path="/dashboard/users" element={<UsersPage />} />
              <Route path="/dashboard/users/:userId" element={<UserDetailPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
