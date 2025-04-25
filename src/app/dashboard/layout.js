import Sidebar from '@/components/dashboard/Sidebar'

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto w-full">
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
