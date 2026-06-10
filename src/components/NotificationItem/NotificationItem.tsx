"use client"

import { Mail, MessageSquare, Bell, CheckCircle2, AlertCircle, Clock, Send, X, Trash2, RotateCw } from "lucide-react"
import { NotificationJob } from "@/types/Notification"

interface NotificationItemTypes {
    notification: NotificationJob,
    onSend: (id: string) => void,
    onCancel: (id: string) => void,
    onDelete: (id: string) => void,
    onRetry: (id: string) => void
}

const channelIcons = {
    email: Mail,
    sms: MessageSquare,
    push: Bell
}

const channelLabels = {
    email: "Email",
    sms: "SMS",
    push: "Push"
}

const buttonPrimary = "inline-flex items-center justify-center gap-1.5 rounded-xl border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-blue-700 hover:border-blue-700 active:scale-[0.97] cursor-pointer"
const buttonSecondary = "inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-gray-50 active:scale-[0.97] cursor-pointer"
const buttonDanger = "inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-600 bg-red-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-red-700 hover:border-red-700 active:scale-[0.97] cursor-pointer"

export function NotificationItem({ notification, onSend, onCancel, onDelete, onRetry }: NotificationItemTypes) {
    const ChannelIcon = channelIcons[notification.channel]

    const isSending = notification.status === "sending"

    return (
        <div className={`animate-fade-in-up flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6 lg:px-8 bg-white border rounded-2xl shadow-sm hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200 ease-out ${
            isSending ? "border-blue-200 ring-1 ring-blue-100" : "border-gray-100"
        }`}>
            <div className="flex items-center gap-3 md:w-1/3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
                    <ChannelIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">{notification.title}</p>
                    <p className="text-xs text-gray-400">{channelLabels[notification.channel]}</p>
                </div>
            </div>

            <div className="md:w-1/3">
                <StatusBadge notification={notification} />
            </div>

            <div className="flex items-center gap-2 md:w-1/3 md:justify-end">
                {notification.status === "queued" && (
                    <button onClick={() => onSend(notification.id)} className={buttonPrimary}>
                        <Send className="h-4 w-4" />
                        Enviar
                    </button>
                )}

                {notification.status === "sending" && (
                    <button onClick={() => onCancel(notification.id)} className={buttonSecondary}>
                        <X className="h-4 w-4" />
                        Cancelar
                    </button>
                )}

                {notification.status === "failed" && (
                    <button onClick={() => onRetry(notification.id)} className={buttonPrimary}>
                        <RotateCw className="h-4 w-4" />
                        Reintentar
                    </button>
                )}

                <button onClick={() => onDelete(notification.id)} className={buttonDanger}>
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                </button>
            </div>
        </div>
    )
}

function StatusBadge({ notification }: { notification: NotificationJob }) {
    if (notification.status === "queued") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                <Clock className="h-3.5 w-3.5" />
                En cola
            </span>
        )
    }

    if (notification.status === "sending") {
        return (
            <div className="flex w-full flex-col gap-1.5">
                <span className="text-xs font-medium text-gray-500">Enviando... {notification.progress}%</span>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                        className="h-full rounded-full bg-blue-600 transition-all duration-150 ease-out"
                        style={{ width: `${notification.progress}%` }}
                    />
                </div>
            </div>
        )
    }

    if (notification.status === "sent") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Enviado
            </span>
        )
    }

    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
            <AlertCircle className="h-3.5 w-3.5" />
            Fallido
        </span>
    )
}
