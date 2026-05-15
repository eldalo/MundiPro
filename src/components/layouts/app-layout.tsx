import { Outlet } from 'react-router'
import { BottomNav } from './bottom-nav'
import { Sidebar } from './sidebar'
import { TopBar } from './top-bar'

export function AppLayout() {
  return (
    <div className="bg-background text-foreground flex min-h-svh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <TopBar />
        <main
          className="flex-1 pb-20 lg:pb-0"
          id="main"
        >
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
            <Outlet />
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
