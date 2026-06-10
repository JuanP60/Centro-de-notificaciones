export type NotificationChannel = "email" | "sms" | "push"

export type NotificationStatus = "queued" | "sending" | "sent" | "failed"

interface BaseNotificationJob {
    id: string,
    title: string,
    channel: NotificationChannel
}

// discriminated union: progress solo existe cuando status es "sending"
export type NotificationJob =
    | (BaseNotificationJob & { status: "queued" })
    | (BaseNotificationJob & { status: "sending", progress: number })
    | (BaseNotificationJob & { status: "sent" })
    | (BaseNotificationJob & { status: "failed" })

// forma de entrada flexible para normalizar datos de distintos orígenes
export interface NotificationInput {
    id?: string,
    title: string,
    channel: NotificationChannel,
    status?: NotificationStatus,
    progress?: number
}

// valores del formulario para crear una notificación
export interface NotificationFormValues {
    title: string,
    channel: NotificationChannel | ""
}

// error que se muestra antes de ejecutar "Send All"
export interface SendAllError {
    title: string,
    notifications: string[]
}

export const NOTIFICATION_STATUS_FILTERS: NotificationStatus[] = ["queued", "sending", "sent", "failed"]
