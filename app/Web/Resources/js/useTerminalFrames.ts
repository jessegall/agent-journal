import type { ScreenFrameData, TerminalFrameData } from '@generated/types/core';
import type { TerminalWindowData } from '@/types/generated';
import { router } from '@inertiajs/vue3';
import { newRequestId } from '@/kit/requestId';
import { openTerminal, renewTerminal } from '@/routes/web';
import type { Ref } from 'vue';
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue';
import { supersedes } from './terminalFrameOrder';

/**
 * How often the page reloads its frame, and how often it renews its view.
 */
const POLL_MILLISECONDS = 500;
const RENEW_MILLISECONDS = 10_000;

/**
 * How long without any frame, the host's 10 second sign of life included, before the host counts as silent.
 */
const SILENT_MILLISECONDS = 15_000;

/**
 * Where the view stands: opening, refused with a message, or showing the screen as live, ended or just restarted.
 */
export type TerminalViewState =
    | 'opening'
    | 'refused'
    | 'live'
    | 'ended'
    | 'restarted';

/**
 * Holds a viewer's lease on an agent's terminal through the terminal page's own Inertia actions: opens its own read
 * interest on mount with a fresh request id, learns the interest's id, renews exactly that interest every 10 seconds
 * and reloads only the page's data every half second with the frame it holds. Leaving the page or hiding it stops the
 * reloads, and the lease runs out by itself. It only reads; nothing reaches the driver.
 */
export function useTerminalFrames(data: Ref<TerminalWindowData>) {
    const state = ref<TerminalViewState>('opening');
    const refusal = ref('');
    const drawn = shallowRef<ScreenFrameData | null>(null);
    const receivedAt = ref(Date.now());
    const endedAt = ref('');
    const held = { epoch: '', after: 0 };
    const interest = { id: '', requestId: '' };
    const now = ref(Date.now());
    const timers: number[] = [];
    const actions = { open: openTerminal, renew: renewTerminal };

    function refuse(message: string): void {
        state.value = 'refused';
        refusal.value = message;
        stopTimers();
    }

    function receive(answer: TerminalFrameData): void {
        state.value = answer.state;
        if (answer.endedAt !== undefined) {
            endedAt.value = answer.endedAt;
        }
        const { frame, receivedAt: frameReceivedAt } = answer;
        if (frame === undefined || frameReceivedAt === undefined) {
            return;
        }
        if (!supersedes(frame, drawn.value)) {
            return;
        }
        drawn.value = frame;
        receivedAt.value = Date.parse(frameReceivedAt);
        held.epoch = frame.epoch;
        held.after = frame.sequence;
    }

    watch(
        () => data.value.frame,
        (frame) => {
            if (frame !== undefined && state.value !== 'opening' && state.value !== 'refused') {
                receive(frame);
            }
        },
    );

    watch(
        () => data.value.readInterestId,
        (readInterestId) => {
            if (readInterestId !== undefined && state.value === 'opening' && interest.id === '') {
                interest.id = readInterestId;
                begin();
            }
        },
    );

    function send(verb: 'open' | 'renew', body: Record<string, string>, onSuccess: () => void = () => undefined): void {
        router.post(
            actions[verb].url(data.value.agentId),
            body,
            {
                only: ['page'],
                preserveState: true,
                preserveScroll: true,
                onSuccess,
                onError: (errors) => refuse(errors.review ?? 'The terminal view was refused.'),
            },
        );
    }

    function poll(): void {
        now.value = Date.now();
        router.reload({ only: ['page'], data: { ...held, interest: interest.id }, async: true });
    }

    function open(): void {
        state.value = 'opening';
        interest.id = '';
        interest.requestId = newRequestId();
        held.epoch = '';
        held.after = 0;
        send('open', { requestId: interest.requestId }, () =>
            router.reload({ only: ['page'], data: { request: interest.requestId } }),
        );
    }

    function stopTimers(): void {
        timers.splice(0).forEach((timer) => window.clearInterval(timer));
    }

    function begin(): void {
        state.value = 'live';
        receivedAt.value = Date.now();
        timers.push(window.setInterval(poll, POLL_MILLISECONDS));
        timers.push(window.setInterval(() => send('renew', { interest: interest.id }), RENEW_MILLISECONDS));
        poll();
    }

    function pauseWhenHidden(): void {
        if (document.visibilityState === 'hidden') {
            stopTimers();

            return;
        }
        if (timers.length === 0 && state.value !== 'refused') {
            open();
        }
    }

    onMounted(() => {
        document.addEventListener('visibilitychange', pauseWhenHidden);
        open();
    });
    onBeforeUnmount(() => {
        document.removeEventListener('visibilitychange', pauseWhenHidden);
        stopTimers();
    });

    function isSilent(): boolean {
        return state.value === 'live' && now.value - receivedAt.value > SILENT_MILLISECONDS;
    }

    function ageSeconds(): number {
        return Math.max(0, (now.value - receivedAt.value) / 1000);
    }

    return { state, refusal, drawn, endedAt, isSilent, ageSeconds };
}
