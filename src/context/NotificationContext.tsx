"use client"

import { createContext, useCallback, useContext, useRef, useState, ReactNode } from "react"
import { NotificationChannel, NotificationJob, NotificationStatus, SendAllError } from "@/types/Notification"
import { NotificationContextType } from "@/types/Context"
import { runQueue } from "@/lib/queue"
import { getRetryDelay, simulateSend } from "@/lib/simulateSend"
import seedData from "@/data/notifications.json"

const NotificationContext = createContext<NotificationContextType | null>(null)

const SEND_ALL_CONCURRENCY = 2

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<NotificationJob[]>(seedData as NotificationJob[])

    // controllers para cancelar envíos en curso, y conteo de intentos para el backoff
    const controllersRef = useRef(new Map<string, AbortController>())
    const attemptsRef = useRef(new Map<string, number>())

    const updateStatus = useCallback((id: string, status: NotificationStatus, progress?: number) => {
        setNotifications((prev) => prev.map((notification) => {
            if (notification.id !== id) return notification

            if (status === "sending") {
                return { id: notification.id, title: notification.title, channel: notification.channel, status, progress: progress ?? 0 }
            }

            return { id: notification.id, title: notification.title, channel: notification.channel, status }
        }))
    }, [])

    const sendNotificationAsync = useCallback(async (id: string) => {
        const controller = new AbortController()
        controllersRef.current.set(id, controller)

        updateStatus(id, "sending", 0)

        try {
            const result = await simulateSend(controller.signal, (progress) => {
                updateStatus(id, "sending", progress)
            })

            updateStatus(id, result)

            if (result === "sent") {
                attemptsRef.current.delete(id)
            }
        } catch {
            // cancelado: vuelve a queued
            updateStatus(id, "queued")
        } finally {
            controllersRef.current.delete(id)
        }
    }, [updateStatus])

    const addNotification = useCallback((title: string, channel: NotificationChannel) => {
        setNotifications((prev) => [
            ...prev,
            { id: crypto.randomUUID(), title, channel, status: "queued" }
        ])
    }, [])

    const deleteNotification = useCallback((id: string) => {
        controllersRef.current.get(id)?.abort()
        controllersRef.current.delete(id)
        attemptsRef.current.delete(id)

        setNotifications((prev) => prev.filter((notification) => notification.id !== id))
    }, [])

    const sendNotification = useCallback((id: string) => {
        sendNotificationAsync(id)
    }, [sendNotificationAsync])

    const cancelNotification = useCallback((id: string) => {
        controllersRef.current.get(id)?.abort()
    }, [])

    const retryNotification = useCallback((id: string) => {
        const attempt = attemptsRef.current.get(id) ?? 0
        attemptsRef.current.set(id, attempt + 1)

        updateStatus(id, "queued")

        const delay = getRetryDelay(attempt)
        setTimeout(() => sendNotificationAsync(id), delay)
    }, [sendNotificationAsync, updateStatus])

    const sendAll = useCallback((): SendAllError | null => {
        const errors: string[] = []

        if (notifications.length < 1) {
            errors.push("Agrega al menos una notificación antes de enviar todo")
        }

        const sendingCount = notifications.filter((notification) => notification.status === "sending").length
        if (sendingCount > 0) {
            errors.push(`Hay ${sendingCount} notificación(es) enviándose, espera a que terminen`)
        }

        if (errors.length > 0) {
            return { title: "Notification error", notifications: errors }
        }

        const queuedIds = notifications
            .filter((notification) => notification.status === "queued")
            .map((notification) => notification.id)

        runQueue(SEND_ALL_CONCURRENCY, queuedIds.map((id) => () => sendNotificationAsync(id)))

        return null
    }, [notifications, sendNotificationAsync])

    const pendingCount = notifications.filter((notification) => notification.status === "queued").length
    const existingTitles = notifications.map((notification) => notification.title.trim().toLowerCase())

    return (
        <NotificationContext.Provider value={{
            notifications,
            pendingCount,
            existingTitles,
            addNotification,
            deleteNotification,
            sendNotification,
            cancelNotification,
            retryNotification,
            sendAll
        }}>
            {children}
        </NotificationContext.Provider>
    )
}

export function notificationContext() {
    const data = useContext(NotificationContext)

    if (!data) { throw new Error("Error en Provider") } // validar primero si no es null, sin validacion tsx no permite usar el export del provider

    return data
}
