export async function promiseEach<T>(arr: T[], callback: (elem: T) => Promise<any>): Promise<void> {
    for (const item of arr) {
        await callback(item);
    }
}