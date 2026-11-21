/**
 * How long something ran, in the largest two units that matter: 1m 5s, 2h 3m, 40s.
 */
export function elapsed(milliseconds: number): string {
    const seconds = Math.max(0, Math.floor(milliseconds / 1000));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const rest = seconds % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }

    return minutes > 0 ? `${minutes}m ${rest}s` : `${rest}s`;
}
