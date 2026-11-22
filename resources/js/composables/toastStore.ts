import { ref } from 'vue';
import type { Ref } from 'vue';

/**
 * How long a success or a report toast stays on screen while nothing holds it.
 */
export const SUCCESS_MILLISECONDS = 8_000;

/**
 * The most toasts shown one by one; every later outcome joins the summary surface, so three surfaces at most.
 */
export const INDIVIDUAL_LIMIT = 2;

/**
 * How long outcomes that arrive together wait to be spoken as one.
 */
const SPEECH_GATHER_MILLISECONDS = 300;

export type ToastType = 'success' | 'failure' | 'report';

/**
 * One live outcome as a toast presents it: a key of its own, its type, a plain title and the server's destination.
 */
export type ToastOutcome = { key: string; type: ToastType; title: string; href: string };

export type Toast = ToastOutcome & { holds: string[] };

export type ToastStore = {
    toasts: Ref<Toast[]>;
    summary: Ref<ToastOutcome[]>;
    announcement: Ref<string>;
    isQuiet: Ref<boolean>;
    show(outcome: ToastOutcome): void;
    hold(key: string, reason: string): void;
    release(key: string, reason: string): void;
    holdAll(reason: string): void;
    releaseAll(reason: string): void;
    dismiss(key: string): void;
    dismissSummary(): void;
    quiet(): void;
    resume(): void;
    clear(): void;
};

type Countdown = { remaining: number; startedAt: number; timer: ReturnType<typeof setTimeout> | undefined };

/**
 * The shell's toasts and their one polite announcement: two toasts at most one by one and a summary for the rest, a
 * success leaving after eight seconds of display that nothing holds, a failure staying until dismissed; quiet clears
 * everything and admits nothing until resumed. Dismissing never marks a receipt read.
 */
export function toastStore(now: () => number = Date.now): ToastStore {
    const toasts = ref<Toast[]>([]);
    const summary = ref<ToastOutcome[]>([]);
    const announcement = ref('');
    const isQuiet = ref(false);
    const countdowns = new Map<string, Countdown>();
    let gathered: ToastOutcome[] = [];
    let speechTimer: ReturnType<typeof setTimeout> | undefined;
    let globalHolds: string[] = [];

    function isHeld(toast: Toast): boolean {
        return toast.holds.length > 0 || globalHolds.length > 0;
    }

    function startCountdown(toast: Toast): void {
        const countdown = countdowns.get(toast.key);

        if (countdown === undefined || isHeld(toast)) {
            return;
        }

        countdown.startedAt = now();
        countdown.timer = setTimeout(() => dismiss(toast.key), countdown.remaining);
    }

    function stopCountdown(key: string): void {
        const countdown = countdowns.get(key);

        if (countdown === undefined || countdown.timer === undefined) {
            return;
        }

        clearTimeout(countdown.timer);
        countdown.timer = undefined;
        countdown.remaining = Math.max(0, countdown.remaining - (now() - countdown.startedAt));
    }

    function speak(outcome: ToastOutcome): void {
        gathered.push(outcome);
        clearTimeout(speechTimer);
        speechTimer = setTimeout(() => {
            announcement.value = gathered.length === 1 ? gathered[0].title : `${gathered.length} new outcomes`;
            gathered = [];
        }, SPEECH_GATHER_MILLISECONDS);
    }

    function show(outcome: ToastOutcome): void {
        if (isQuiet.value) {
            return;
        }

        speak(outcome);

        if (toasts.value.length >= INDIVIDUAL_LIMIT) {
            summary.value = [...summary.value, outcome];

            return;
        }

        const toast: Toast = { ...outcome, holds: [] };
        toasts.value = [...toasts.value, toast];

        if (outcome.type !== 'failure') {
            countdowns.set(outcome.key, { remaining: SUCCESS_MILLISECONDS, startedAt: now(), timer: undefined });
            startCountdown(toast);
        }
    }

    function changeHolds(key: string, change: (holds: string[]) => string[]): Toast | undefined {
        const toast = toasts.value.find((shown) => shown.key === key);

        if (toast !== undefined) {
            toast.holds = change(toast.holds);
        }

        return toast;
    }

    function hold(key: string, reason: string): void {
        stopCountdown(key);
        changeHolds(key, (holds) => [...new Set([...holds, reason])]);
    }

    function release(key: string, reason: string): void {
        const toast = changeHolds(key, (holds) => holds.filter((held) => held !== reason));

        if (toast !== undefined) {
            startCountdown(toast);
        }
    }

    function holdAll(reason: string): void {
        globalHolds = [...new Set([...globalHolds, reason])];
        toasts.value.forEach((toast) => stopCountdown(toast.key));
    }

    function releaseAll(reason: string): void {
        globalHolds = globalHolds.filter((held) => held !== reason);
        toasts.value.forEach(startCountdown);
    }

    function dismiss(key: string): void {
        stopCountdown(key);
        countdowns.delete(key);
        toasts.value = toasts.value.filter((toast) => toast.key !== key);
    }

    function dismissSummary(): void {
        summary.value = [];
    }

    function clear(): void {
        countdowns.forEach((countdown) => clearTimeout(countdown.timer));
        countdowns.clear();
        clearTimeout(speechTimer);
        gathered = [];
        toasts.value = [];
        summary.value = [];
        announcement.value = '';
    }

    function quiet(): void {
        clear();
        isQuiet.value = true;
    }

    function resume(): void {
        isQuiet.value = false;
    }

    return {
        toasts,
        summary,
        announcement,
        isQuiet,
        show,
        hold,
        release,
        holdAll,
        releaseAll,
        dismiss,
        dismissSummary,
        quiet,
        resume,
        clear,
    };
}
