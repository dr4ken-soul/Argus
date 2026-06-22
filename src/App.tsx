import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { useAppStore } from './store/useAppStore'

const Landing = lazy(() => import('./pages/Landing'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Research = lazy(() => import('./pages/Research'))
const Vault = lazy(() => import('./pages/Vault'))
const Journal = lazy(() => import('./pages/Journal'))

/**
 * Top-level route tree.
 */
export default function App() {
  const hydrateVault = useAppStore((state) => state.hydrateVault)

  useEffect(() => {
    hydrateVault()
  }, [hydrateVault])

  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="research" element={<Research />} />
          <Route path="vault" element={<Vault />} />
          <Route path="journal" element={<Journal />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

/**
 * Minimal page-level skeleton for lazy route loading.
 */
function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] px-8 pt-24">
      <div className="skeleton mx-auto h-8 max-w-4xl rounded" />
      <div className="skeleton mx-auto mt-6 h-64 max-w-4xl rounded-2xl" />
    </div>
  )
}
