import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { NotificationProvider } from "@/context/NotificationContext"
import "./globals.css"

const dmSans = DM_Sans({
    subsets: ["latin"],
    variable: "--font-dm-sans"
})

export const metadata: Metadata = {
    title: "Centro de Notificaciones",
    description: "Gestión y envío simulado de notificaciones"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
            <body className={`${dmSans.variable} antialiased bg-gray-50`}>
                {/* envolvemos todo el content para acceder al contexto de notificaciones */}
                <NotificationProvider>
                    {children}
                </NotificationProvider>
            </body>
        </html>
    )
}
