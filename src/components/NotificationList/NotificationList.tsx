"use client"

import { useState } from "react"
import { AlertTriangle, Inbox, SendHorizontal, X } from "lucide-react"
import { notificationContext } from "@/context/NotificationContext"
import { NotificationItem } from "../NotificationItem/NotificationItem"
import { NotificationStatus, SendAllError } from "@/types/Notification"

const filters: { value: NotificationStatus | "all", label: string }[] = [
    { value: "all", label: "Todas" },
    { value: "queued", label: "En cola" },
    { value: "sending", label: "Enviando" },
    { value: "sent", label: "Enviado" },
    { value: "failed", label: "Fallido" }
]

export function NotificationList() {
    const { notifications, sendNotification, cancelNotification, deleteNotification, retryNotification, sendAll } = notificationContext()

    const [filter, setFilter] = useState<NotificationStatus | "all">("all")
    const [sendAllError, setSendAllError] = useState<SendAllError | null>(null)

    const filtered = filter === "all" ? notifications : notifications.filter((notification) => notification.status === filter)

    const onSendAll = () => {
        setSendAllError(sendAll())
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                    {filters.map((item) => (
                        <button
                            key={item.value}
                            onClick={() => setFilter(item.value)}
                            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-200 ease-out active:scale-[0.97] cursor-pointer ${
                                filter === item.value
                                    ? "border-black bg-black text-white"
                                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={onSendAll}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-600 bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-blue-700 hover:border-blue-700 active:scale-[0.97] cursor-pointer sm:w-auto"
                >
                    <SendHorizontal className="h-4 w-4" />
                    Enviar Todo
                </button>
            </div>

            {sendAllError && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-red-700">{sendAllError.title}</p>
                        <ul className="mt-1 list-disc pl-4 text-sm text-red-600">
                            {sendAllError.notifications.map((message, index) => (
                                <li key={index}>{message}</li>
                            ))}
                        </ul>
                    </div>
                    <button onClick={() => setSendAllError(null)} className="text-red-400 transition-colors hover:text-red-600 cursor-pointer">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            <div className="flex flex-col gap-3">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-200 py-14 text-center text-gray-400">
                        <Inbox className="h-8 w-8" />
                        <p className="text-sm">No hay notificaciones{filter !== "all" ? " con este estado" : ""}</p>
                    </div>
                ) : (
                    filtered.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onSend={sendNotification}
                            onCancel={cancelNotification}
                            onDelete={deleteNotification}
                            onRetry={retryNotification}
                        />
                    ))
                )}
            </div>
        </div>
    )
}
