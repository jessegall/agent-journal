// The shared kit a domain's components import as @kit/format: the one place times, numbers and sizes are written for
// the screen, in the viewer's language and time zone.

/** A moment as the server sends it: an ISO 8601 string, or milliseconds since the epoch. */
export type Moment = string | number | Date;

function dateOf(at: Moment): Date {
    return at instanceof Date ? at : new Date(at);
}

function spanOf(seconds: number): string {
    if (seconds < 3600) {
        return `${Math.round(seconds / 60)}m`;
    }

    return seconds < 86_400 ? `${Math.round(seconds / 3600)}h` : `${Math.round(seconds / 86_400)}d`;
}

/**
 * How long ago a moment was, in its largest unit: just now, 4m ago, 3h ago, 2d ago; a moment ahead says in 4m.
 */
export function timeAgo(at: Moment, now: Moment = Date.now()): string {
    const seconds = Math.round((dateOf(now).getTime() - dateOf(at).getTime()) / 1000);

    if (Math.abs(seconds) < 45) {
        return 'just now';
    }

    return seconds < 0 ? `in ${spanOf(-seconds)}` : `${spanOf(seconds)} ago`;
}

/**
 * A moment's date and time in the viewer's zone, such as 3 Nov 2026, 12:19.
 */
export function dateTime(at: Moment): string {
    return dateOf(at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

/**
 * A moment's date and time with the zone named, for a fact the viewer may compare across zones.
 */
export function dateTimeWithZone(at: Moment): string {
    return dateOf(at).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
    });
}

/**
 * A moment's date alone in the viewer's zone, such as 3 Nov 2026.
 */
export function dateOnly(at: Moment): string {
    return dateOf(at).toLocaleDateString(undefined, { dateStyle: 'medium' });
}

/**
 * A moment's time of day alone in the viewer's zone, such as 12:19.
 */
export function timeOfDay(at: Moment): string {
    return dateOf(at).toLocaleTimeString(undefined, { timeStyle: 'short' });
}

/**
 * A moment's short weekday in the viewer's zone, such as Tue.
 */
export function weekday(at: Moment): string {
    return dateOf(at).toLocaleDateString(undefined, { weekday: 'short' });
}

/**
 * A month and year, such as November 2026, read in UTC for a month the server counts in UTC.
 */
export function monthInUtc(at: Moment): string {
    return dateOf(at).toLocaleDateString(undefined, { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

/**
 * How long something ran, in the largest two units that matter: 1m 5s, 2h 3m, 40s.
 */
export function elapsed(milliseconds: number): string {
    const total = Math.max(0, Math.floor(milliseconds / 1000));
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const rest = total % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }

    return minutes > 0 ? `${minutes}m ${rest}s` : `${rest}s`;
}

/**
 * Seconds with one decimal, for a reading that changes every moment: 2.4 s.
 */
export function seconds(value: number): string {
    return `${value.toFixed(1)} s`;
}

/**
 * A whole count with its thousands grouped, such as 12,345.
 */
export function count(value: number): string {
    return value.toLocaleString('en-US');
}

/**
 * A count with its noun, one or many: 1 task, 3 tasks.
 */
export function counted(value: number, one: string, many: string): string {
    return `${count(value)} ${value === 1 ? one : many}`;
}

/**
 * Dollars as the journal writes them: two decimals, less than a cent for a positive amount below one, and a real zero
 * as $0.00.
 */
export function dollars(amount: number): string {
    if (amount > 0 && amount < 0.01) {
        return '< $0.01';
    }

    return `$${amount.toFixed(2)}`;
}

const SIZE_UNITS = ['B', 'kB', 'MB', 'GB', 'TB'] as const;

/**
 * A byte size in decimal units with one decimal past bytes: 512 B, 1.4 kB, 9.0 MB.
 */
export function size(bytes: number): string {
    let value = Math.max(0, bytes);
    let unit = 0;

    while (value >= 1000 && unit < SIZE_UNITS.length - 1) {
        value /= 1000;
        unit++;
    }

    return unit === 0 ? `${value} B` : `${value.toFixed(1)} ${SIZE_UNITS[unit]}`;
}
