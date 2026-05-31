import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/admin/Sidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Sidebar */}
      <Sidebar userEmail={user.email} />

      {/* Main content */}
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  )
}
