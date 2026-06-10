"use client"

import { Clock, Loader2, CheckCircle2, AlertCircle, LucideIcon } from "lucide-react"
import { notificationContext } from "@/context/NotificationContext"
import { NotificationStatus } from "@/types/Notification"

interface StatConfig {
    status: NotificationStatus,
    label: string,
    icon: LucideIcon,
    iconClasses: string
}

const statsConfig: StatConfig[] = [
    { status: "queued", label: "En cola", icon: Clock, iconClasses: "border-amber-100 bg-amber-50 text-amber-600" },
    { status: "sending", label: "Enviando", icon: Loader2, iconClasses: "border-blue-100 bg-blue-50 text-blue-600" },
    { status: "sent", label: "Enviados", icon: CheckCircle2, iconClasses: "border-emerald-100 bg-emerald-50 text-emerald-600" },
    { status: "failed", label: "Fallidos", icon: AlertCircle, iconClasses: "border-red-100 bg-red-50 text-red-600" }
]

export function NotificationStats() {
    const { notifications } = notificationContext()

    return (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {statsConfig.map(({ status, label, icon: Icon, iconClasses }) => {
                const count = notifications.filter((notification) => notification.status === status).length
                const isSpinning = status === "sending" && count > 0

                return (
                    <div
                        key={status}
                        className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
                    >
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${iconClasses}`}>
                            <Icon className={`h-5 w-5 ${isSpinning ? "animate-spin" : ""}`} />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-gray-900">{count}</p>
                            <p className="text-xs text-gray-400">{label}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
