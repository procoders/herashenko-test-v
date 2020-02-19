export function monthToDate(month: number): Date {
    return new Date(Date.now() - 1000 * 60 * 60 * 24 * (30 * month));
}
