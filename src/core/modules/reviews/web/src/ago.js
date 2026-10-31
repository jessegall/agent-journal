const MINUTE_SECONDS = 60;
const HOUR_SECONDS = 3600;
const DAY_SECONDS = 86400;

// how long ago a stored time was, in the fewest words
export function ago(stored, now = Date.now()) {
    const seconds = Math.max(0, Math.floor((now - Date.parse(stored)) / 1000));
    if (seconds < MINUTE_SECONDS) return "just now";
    if (seconds < HOUR_SECONDS) return `${Math.floor(seconds / MINUTE_SECONDS)} min ago`;
    if (seconds < DAY_SECONDS) return `${Math.floor(seconds / HOUR_SECONDS)} h ago`;
    return `${Math.floor(seconds / DAY_SECONDS)} d ago`;
}
