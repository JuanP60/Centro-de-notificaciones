"use client"

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik"
import * as Yup from "yup"
import { BellPlus, Plus } from "lucide-react"
import { notificationContext } from "@/context/NotificationContext"
import { NotificationChannel, NotificationFormValues } from "@/types/Notification"

const MAX_PENDING = 5

const channelOptions: { value: NotificationChannel, label: string }[] = [
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS" },
    { value: "push", label: "Push" }
]

const inputClasses = "w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-black focus:ring-1 focus:ring-black"

export function NotificationForm() {
    const { addNotification, existingTitles, pendingCount } = notificationContext()

    const limitReached = pendingCount >= MAX_PENDING

    const initialValues: NotificationFormValues = { title: "", channel: "" }

    // títulos únicos (4c) y validación de campos requeridos
    const validationSchema = Yup.object({
        title: Yup.string()
            .trim()
            .required("El título es obligatorio")
            .test("unique-title", "Ya existe una notificación con este título", (value) => {
                if (!value) return true
                return !existingTitles.includes(value.trim().toLowerCase())
            }),
        channel: Yup.string()
            .oneOf(["email", "sms", "push"], "Selecciona un canal")
            .required("El canal es obligatorio")
    })

    const onSubmit = (values: NotificationFormValues, { resetForm }: FormikHelpers<NotificationFormValues>) => {
        if (values.channel === "") return // ya cubierto por la validación, solo para el type guard

        addNotification(values.title.trim(), values.channel)
        resetForm()
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            validateOnBlur
            enableReinitialize
        >
            {({ isValid, dirty }) => (
                <Form className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-6">
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <BellPlus className="h-4.5 w-4.5" />
                        </div>
                        <h2 className="text-sm font-semibold text-gray-900">Nueva notificación</h2>
                    </div>

                    {/* misma estructura (label + control + slot de error) en las 3 columnas para que todo quede a la misma altura */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-start">
                        <div className="flex w-full flex-col gap-1.5">
                            <label htmlFor="title" className="text-sm font-medium text-gray-700">Título</label>
                            <Field
                                id="title"
                                name="title"
                                type="text"
                                placeholder="Escribe el título..."
                                className={inputClasses}
                            />
                            <ErrorMessage name="title" component="p" className="min-h-4 text-xs text-red-600" />
                        </div>

                        <div className="flex w-full flex-col gap-1.5 md:w-72">
                            <label htmlFor="channel" className="text-sm font-medium text-gray-700">Canal</label>
                            <Field
                                id="channel"
                                name="channel"
                                as="select"
                                className={`${inputClasses} appearance-none hover:cursor-pointer`}
                            >
                                <option value="">Selecciona un canal</option>
                                {channelOptions.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="channel" component="p" className="min-h-4 text-xs text-red-600" />
                        </div>

                        <div className="flex w-full flex-col gap-1.5 md:w-auto">
                            <span aria-hidden className="hidden text-sm font-medium text-transparent md:block">Acción</span>
                            <button
                                type="submit"
                                disabled={limitReached || (!dirty || !isValid)}
                                className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-blue-600 bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-blue-700 hover:border-blue-700 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 cursor-pointer md:w-auto"
                            >
                                <Plus className="h-4 w-4" />
                                Agregar Notificación
                            </button>
                            <span aria-hidden className="hidden min-h-4 text-xs md:block" />
                        </div>
                    </div>

                    {limitReached && (
                        <p className="text-xs text-amber-700">
                            Ya tienes {MAX_PENDING} notificaciones en cola. Envía o elimina alguna antes de agregar más.
                        </p>
                    )}
                </Form>
            )}
        </Formik>
    )
}
