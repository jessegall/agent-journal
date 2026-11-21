import type {
    AccountMonthCostData,
    AccountThreadTokensData,
    AccountUsageData,
    AccountUsageWindowData,
    UsageWindowSlot,
} from '@generated/types/accounts';

/**
 * What an account's usage shows: the one line of its row and the details of its settings, chosen from the readings
 * its programs reported. Every choice takes the current time, so the page can choose again when a window resets.
 */

const minutesOfWeek = 10080;
const minutesOfFiveHours = 300;

const slotLabel: Record<UsageWindowSlot, string> = {
    five_hour: '5-hour',
    seven_day: 'Week',
    primary: 'Primary',
    secondary: 'Secondary',
};

/**
 * The order a row prefers its window in after the week: Codex's secondary before its primary window, the five-hour
 * window last.
 */
const slotPreference: Record<UsageWindowSlot, number> = {
    seven_day: 0,
    secondary: 1,
    primary: 2,
    five_hour: 3,
};

/**
 * The name of a window from its real length: Week, 5-hour, or the length in words; the slot's own name when the
 * length was not reported.
 */
export function windowLabel(window: AccountUsageWindowData): string {
    const minutes = window.windowMinutes;

    if (minutes === null) {
        return slotLabel[window.slot];
    }

    if (minutes === minutesOfWeek) {
        return 'Week';
    }

    if (minutes === minutesOfFiveHours) {
        return '5-hour';
    }

    return lengthInWords(minutes);
}

function lengthInWords(minutes: number): string {
    if (minutes % 1440 === 0) {
        return `${minutes / 1440}-day`;
    }

    if (minutes % 60 === 0) {
        return `${minutes / 60}-hour`;
    }

    return `${minutes}-minute`;
}

function isWeek(window: AccountUsageWindowData): boolean {
    if (window.windowMinutes === null) {
        return window.slot === 'seven_day';
    }

    return window.windowMinutes === minutesOfWeek;
}

/**
 * A window whose program reported how much of it is used.
 */
type MeasuredWindow = AccountUsageWindowData & { usedPercent: number };

function isMeasured(window: AccountUsageWindowData): window is MeasuredWindow {
    return window.usedPercent !== null;
}

/**
 * Whether a window's reading still holds: its reset, if it named one, has not passed.
 */
export function isCurrent(window: AccountUsageWindowData, now: Date): boolean {
    return window.resetsAt === null || new Date(window.resetsAt) > now;
}

/**
 * The window a row shows: the week when it holds, else the other windows in their order; never one past its reset.
 */
export function rowWindow(
    usage: AccountUsageData,
    now: Date,
): MeasuredWindow | null {
    const current = usage.windows
        .filter(isMeasured)
        .filter((window) => isCurrent(window, now));
    const ranked = [...current].sort((one, other) => rank(one) - rank(other));

    return ranked[0] ?? null;
}

function rank(window: AccountUsageWindowData): number {
    return isWeek(window) ? -1 : slotPreference[window.slot];
}

function percentOf(window: MeasuredWindow): string {
    return `${Math.round(window.usedPercent)}%`;
}

export function windowLine(window: MeasuredWindow): string {
    const used = `${windowLabel(window)} ${percentOf(window)} used`;

    if (window.resetsAt === null) {
        return `Last observed: ${used}`;
    }

    const day = new Date(window.resetsAt).toLocaleDateString(undefined, {
        weekday: 'short',
    });

    return `${used}, resets ${day}`;
}

/**
 * The estimated dollars as the page writes them: two decimals, less than a cent for a positive amount below one,
 * and a real zero as $0.00.
 */
export function dollars(cost: AccountMonthCostData): string {
    const amount = Number(cost.usd);

    if (amount > 0 && amount < 0.01) {
        return '< $0.01';
    }

    return `$${amount.toFixed(2)}`;
}

export function costLine(cost: AccountMonthCostData): string {
    return `Est. ${dollars(cost)} this month`;
}

function tokens(count: number): string {
    return `${count.toLocaleString('en-US')} tokens`;
}

export function threadLine(thread: AccountThreadTokensData): string {
    return `Latest thread: ${tokens(thread.total)}`;
}

/**
 * The one usage line of a row: the month's estimate of an account that pays per use, else its current window, else
 * its latest thread; none for an account without a current reading.
 */
export function usageLine(
    usage: AccountUsageData | undefined,
    now: Date,
): string | null {
    if (usage === undefined) {
        return null;
    }

    if (usage.monthCost !== undefined) {
        return costLine(usage.monthCost);
    }

    const window = rowWindow(usage, now);

    if (window !== null) {
        return windowLine(window);
    }

    if (usage.latestThread !== undefined) {
        return threadLine(usage.latestThread);
    }

    return null;
}

export interface UsageFact {
    term: string;
    value: string;
}

function fullDate(moment: string): string {
    return new Date(moment).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
    });
}

/**
 * Each window with its name and value together, its reset or the reset it passed, and when it was observed.
 */
export function windowFacts(usage: AccountUsageData, now: Date): UsageFact[] {
    return usage.windows
        .filter(isMeasured)
        .map((window) => ({
            term: windowLabel(window),
            value: windowValue(window, now),
        }));
}

function windowValue(window: MeasuredWindow, now: Date): string {
    const observed = `observed ${fullDate(window.observedAt)}`;

    if (window.resetsAt === null) {
        return `${percentOf(window)} used, ${observed}`;
    }

    if (!isCurrent(window, now)) {
        return `${percentOf(window)} used before it reset ${fullDate(window.resetsAt)}, ${observed}`;
    }

    return `${percentOf(window)} used, resets ${fullDate(window.resetsAt)}, ${observed}`;
}

/**
 * The month's estimate: the amount, the UTC month it covers and its last observation.
 */
export function costFacts(cost: AccountMonthCostData): UsageFact[] {
    const month = new Date(cost.monthStart).toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
    });

    return [
        { term: 'Estimated cost', value: dollars(cost) },
        { term: 'Month', value: `${month}, UTC` },
        { term: 'Last observed', value: fullDate(cost.lastObservedAt) },
    ];
}

/**
 * The latest thread's total and only the parts of it the program reported.
 */
export function threadFacts(thread: AccountThreadTokensData): UsageFact[] {
    const parts: [string, number | null][] = [
        ['Input', thread.input],
        ['Cached input', thread.cachedInput],
        ['Output', thread.output],
        ['Reasoning output', thread.reasoningOutput],
        ['Last turn', thread.lastTurnTotal],
    ];
    const reported = parts
        .filter((part): part is [string, number] => part[1] !== null)
        .map(([term, count]) => ({ term, value: tokens(count) }));

    return [
        { term: 'Latest thread', value: tokens(thread.total) },
        ...reported,
        { term: 'Observed', value: fullDate(thread.observedAt) },
    ];
}
