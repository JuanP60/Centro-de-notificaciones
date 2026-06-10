import { NotificationChannel, NotificationJob, SendAllError } from "./Notification"

export interface NotificationContextType {
    notifications: NotificationJob[],
    pendingCount: number,
    existingTitles: string[],
    addNotification: (title: string, channel: NotificationChannel) => void,
    deleteNotification: (id: string) => void,
    sendNotification: (id: string) => void,
    cancelNotification: (id: string) => void,
    retryNotification: (id: string) => void,
    sendAll: () => SendAllError | null
}
