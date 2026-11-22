import type { TerminalFrameData, TerminalInterestData } from '@generated/types/core';
import { getJson, JsonRequestFailed, postJson } from '@kit/jsonRequests';
import { seconds, timeOfDay } from '@kit/format';
import { newRequestId } from '@/kit/requestId';
import {
    closeTerminalInterest,
    openTerminalInterest,
    renewTerminalInterest,
    terminalFrame,
} from '@/routes/web';
import type { Ref } from 'vue';
import { computed, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue';
import type { TerminalClient, TerminalFailure, TerminalScreen } from './terminalSubscription';
import { TerminalSubscription } from './terminalSubscription';
import { useTerminalControl } from './useTerminalControl';

/**
 * How often the view reads its frame, renews its interest and checks the screen's lifetime.
 */
const POLL_MILLISECONDS = 500;
const RENEW_MILLISECONDS = 10_000;

/**
 * What the terminal's presentation draws: the screen, the one line saying what it is, the notices about it and its
 * age in whole seconds.
 */
export type TerminalPresentation = {
    screen: TerminalScreen;
    stateLine: string;
    notices: string[];
    ageSeconds: number;
};

function clientFor(agentId: string): TerminalClient {
    return {
        open: async (requestId, signal) =>
            (await postJson<TerminalInterestData>(
                openTerminalInterest.url(agentId),
                { requestId },
                signal,
            )) as TerminalInterestData,
        renew: async (interest) =>
            (await postJson<TerminalInterestData>(renewTerminalInterest.url(agentId), {
                interest,
            })) as TerminalInterestData,
        close: async (interest) => {
            await postJson(closeTerminalInterest.url(agentId), { interest });
        },
        frame: (held, signal) =>
            getJson<TerminalFrameData>(terminalFrame.url(agentId, { query: held }), signal),
    };
}

function failureOf(failure: unknown): TerminalFailure {
    if (failure instanceof JsonRequestFailed) {
        return { kind: failure.kind, message: failure.message };
    }

    return { kind: 'lost', message: '' };
}

function clockTime(milliseconds: number): string {
    return new Date(milliseconds).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

/**
 * The one line that says what the screen is now: watching live, last reported, no preview, a silent host, an end or a
 * refusal, each with the time it is about.
 */
function stateLineOf(screen: TerminalScreen, ageSeconds: number): string {
    const lastUpdate = clockTime(screen.receivedAt);

    return {
        opening: 'Opening the terminal…',
        refused: screen.refusal,
        live: `Watching · updated ${seconds(ageSeconds)} ago`,
        last_reported: `Last reported at ${lastUpdate}; this host does not show a live screen`,
        preview_unavailable: 'Terminal preview unavailable',
        not_reporting: `The agent's host stopped reporting; the screen was last updated at ${lastUpdate}`,
        ended: `Session ended at ${timeOfDay(screen.endedAt)}`,
    }[screen.state];
}

/**
 * What a shown frame cannot show as it is, each dated by the last frame that could.
 */
function noticesOf(screen: TerminalScreen): string[] {
    const frame = screen.frame;
    const lastUpdate = clockTime(screen.receivedAt);
    const markers: [boolean, string][] = [
        [frame !== null && frame.noTerminal, "The agent's terminal is not running on its host"],
        [frame !== null && frame.tooLarge, `Screen too large to show; last screen from ${lastUpdate}`],
        [frame !== null && frame.unreadable, `The screen cannot be read; last screen from ${lastUpdate}`],
        [frame !== null && frame.plain, 'Shown without colours'],
    ];

    return markers.filter(([shown]) => shown).map(([, text]) => text);
}

/**
 * The one controller of a view of an agent's terminal: it owns the subscription, opens one read interest when the
 * view mounts or shows again, renews it every 10 seconds, reads every half second, and closes it when the view is
 * hidden, by its placement or by the browser, or unmounts or the agent changes. The presentation it hands out is all a
 * terminal view draws.
 */
export function useTerminalController(agentId: Ref<string>, isShown: Ref<boolean>) {
    const screen = shallowRef<TerminalScreen>({
        state: 'opening',
        frame: null,
        identity: null,
        refusal: '',
        receivedAt: Date.now(),
        endedAt: '',
    });
    const now = shallowRef(Date.now());
    const timers: number[] = [];
    let subscription = subscribe(agentId.value);

    function subscribe(agent: string): TerminalSubscription {
        return new TerminalSubscription(
            clientFor(agent),
            newRequestId,
            () => Date.now(),
            (shown) => {
                if (shown.frame === null) {
                    clearSelection();
                }
                screen.value = shown;
            },
            failureOf,
        );
    }

    function clearSelection(): void {
        window.getSelection()?.removeAllRanges();
    }

    function start(): void {
        stopTimers();
        subscription.open();
        timers.push(
            window.setInterval(() => {
                now.value = Date.now();
                subscription.tick();
                subscription.poll();
            }, POLL_MILLISECONDS),
        );
        timers.push(window.setInterval(() => subscription.renew(), RENEW_MILLISECONDS));
    }

    function stopTimers(): void {
        timers.splice(0).forEach((timer) => window.clearInterval(timer));
    }

    function isWatching(): boolean {
        return isShown.value && document.visibilityState !== 'hidden';
    }

    function followVisibility(): void {
        stopTimers();
        subscription.stop();
        if (isWatching()) {
            start();
        }
    }

    watch(agentId, (agent) => {
        stopTimers();
        subscription.stop();
        subscription = subscribe(agent);
        if (isWatching()) {
            start();
        }
    });
    watch(isShown, followVisibility);

    onMounted(() => {
        document.addEventListener('visibilitychange', followVisibility);
        if (isWatching()) {
            start();
        }
    });
    onBeforeUnmount(() => {
        document.removeEventListener('visibilitychange', followVisibility);
        stopTimers();
        subscription.stop();
    });

    const presentation = computed<TerminalPresentation>(() => {
        const ageSeconds = Math.max(0, Math.round((now.value - screen.value.receivedAt) / 1000));

        return {
            screen: screen.value,
            stateLine: stateLineOf(screen.value, ageSeconds),
            notices: noticesOf(screen.value),
            ageSeconds,
        };
    });

    /**
     * Opens a fresh read, as Retry does for a host that stopped reporting.
     */
    function retry(): void {
        if (isWatching()) {
            start();
        }
    }

    const control = useTerminalControl(agentId, () => subscription.readInterest(), screen, isShown);

    return { presentation, retry, control };
}
