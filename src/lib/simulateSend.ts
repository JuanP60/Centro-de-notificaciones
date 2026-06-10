// simula el envío de una notificación: dura entre 1 y 8 segundos, 20% de probabilidad de fallo
export function simulateSend(
    signal: AbortSignal,
    onProgress: (progress: number) => void
): Promise<"sent" | "failed"> {
    return new Promise((resolve, reject) => {
        if (signal.aborted) {
            reject(new DOMException("Aborted", "AbortError"))
            return
        }

        const duration = 1000 + Math.random() * 7000 // entre 1 y 8 segundos
        const willFail = Math.random() < 0.2 // 20% de probabilidad de fallo
        const startedAt = Date.now()

        let timeoutId: ReturnType<typeof setTimeout>

        const tick = () => {
            const elapsed = Date.now() - startedAt
            const progress = Math.min(100, Math.round((elapsed / duration) * 100))

            onProgress(progress)

            if (elapsed >= duration) {
                resolve(willFail ? "failed" : "sent")
                return
            }

            timeoutId = setTimeout(tick, 100)
        }

        timeoutId = setTimeout(tick, 100)

        signal.addEventListener("abort", () => {
            clearTimeout(timeoutId)
            reject(new DOMException("Aborted", "AbortError"))
        })
    })
}

// delay para reintentos con exponential backoff + jitter
export function getRetryDelay(attempt: number): number {
    const base = 500 // ms
    const max = 8000 // ms

    const exponential = Math.min(max, base * 2 ** attempt)
    const jitter = Math.random() * exponential * 0.5

    return exponential / 2 + jitter
}
