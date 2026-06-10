import { NotificationJob, NotificationInput } from "@/types/Notification"

// convierte distintos tipos de entrada a NotificationJob, sin duplicados por title + channel
export function normalizeNotifications<T extends NotificationInput>(items: T[]): NotificationJob[] {
    const seenKeys = new Set<string>()
    const normalized: NotificationJob[] = []

    for (const item of items) {
        const key = `${item.title}-${item.channel}` // clave para detectar duplicados

        if (seenKeys.has(key)) continue

        seenKeys.add(key)

        const id = item.id ?? crypto.randomUUID()
        const status = item.status ?? "queued"

        if (status === "sending") {
            normalized.push({ id, title: item.title, channel: item.channel, status, progress: item.progress ?? 0 })
        } else {
            normalized.push({ id, title: item.title, channel: item.channel, status })
        }
    }

    return normalized
}
