import { Bell } from "lucide-react"
import { NotificationForm } from "@/components/NotificationForm/NotificationForm"
import { NotificationList } from "@/components/NotificationList/NotificationList"
import { NotificationStats } from "@/components/NotificationStats/NotificationStats"

export default function Home() {
    return (
        <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-4 py-10 md:py-16">
            <header className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
                    <Bell className="h-5 w-5" />
                </div>
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">Centro de Notificaciones</h1>
                    <p className="text-sm text-gray-500">Crea, envía y monitorea notificaciones en tiempo real</p>
                </div>
            </header>

            <NotificationStats />
            <NotificationForm />
            <NotificationList />
        </main>
    )
}
