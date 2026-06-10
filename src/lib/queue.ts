// ejecuta jobs async limitando cuántos corren al mismo tiempo
export async function runQueue<T>(
    concurrency: number,
    jobs: (() => Promise<T>)[]
): Promise<T[]> {
    const results: T[] = new Array(jobs.length)
    let currentIndex = 0

    async function worker() {
        while (currentIndex < jobs.length) {
            const index = currentIndex
            currentIndex++

            results[index] = await jobs[index]()
        }
    }

    const workers = Array.from({ length: Math.min(concurrency, jobs.length) }, () => worker())

    await Promise.all(workers)

    return results
}
