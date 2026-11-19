import type { ScreenFrameData, TerminalFrameData } from '@generated/types/core';
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';
import { deleteLeaving, pollJson, postJson, putJson } from '@kit/jsonRequests';
import { close, frame, open, renew } from '@generated/routes/agents/terminal';
import { supersedes } from './terminalFrameOrder';

/**
 * How often the browser asks for a newer frame, and how often it renews its view.
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
export type TerminalViewState = 'opening' | 'refused' | 'live' | 'ended' | 'restarted';

/**
 * Holds a viewer's lease on an agent's terminal and polls its frames: opens on mount, renews every 10 seconds,
 * polls every half second and closes on unmount or when the page is hidden. It only reads; nothing reaches the program.
 */
export function useTerminalFrames(agentId: string) {
    const state = ref<TerminalViewState>('opening');
    const refusal = ref('');
    const drawn = shallowRef<ScreenFrameData | null>(null);
    const receivedAt = ref(Date.now());
    const endedAt = ref('');
    const held = { epoch: '', after: 0 };
    const now = ref(Date.now());
    const timers: number[] = [];

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
        if (answer.frame === undefined || answer.receivedAt === undefined || !supersedes(answer.frame, drawn.value)) {
            return;
        }
        drawn.value = answer.frame;
        receivedAt.value = Date.parse(answer.receivedAt);
        held.epoch = answer.frame.epoch;
        held.after = answer.frame.sequence;
    }

    async function poll(): Promise<void> {
        now.value = Date.now();
        const reply = await pollJson<TerminalFrameData>(frame.url({ agent: agentId }, { query: { ...held } }));
        if (reply.type === 'refused') {
            refuse(reply.message);

            return;
        }
        if (reply.type === 'value') {
            receive(reply.value);
        }
    }

    async function keepOpen(): Promise<void> {
        const reply = await putJson<object>(renew.url({ agent: agentId }));
        if (!reply.ok) {
            refuse(reply.message);
        }
    }

    function stopTimers(): void {
        timers.splice(0).forEach((timer) => window.clearInterval(timer));
    }

    function leave(): void {
        stopTimers();
        void deleteLeaving(close.url({ agent: agentId }));
    }

    function leaveWhenHidden(): void {
        if (document.visibilityState === 'hidden') {
            leave();

            return;
        }
        if (timers.length === 0 && state.value !== 'refused') {
            void start();
        }
    }

    async function start(): Promise<void> {
        const reply = await postJson<object>(open.url({ agent: agentId }));
        if (!reply.ok) {
            refuse(reply.message);

            return;
        }
        state.value = 'live';
        receivedAt.value = Date.now();
        timers.push(window.setInterval(() => void poll(), POLL_MILLISECONDS));
        timers.push(window.setInterval(() => void keepOpen(), RENEW_MILLISECONDS));
        void poll();
    }

    onMounted(() => {
        document.addEventListener('visibilitychange', leaveWhenHidden);
        void start();
    });
    onBeforeUnmount(() => {
        document.removeEventListener('visibilitychange', leaveWhenHidden);
        leave();
    });

    function isSilent(): boolean {
        return state.value === 'live' && now.value - receivedAt.value > SILENT_MILLISECONDS;
    }

    function ageSeconds(): number {
        return Math.max(0, (now.value - receivedAt.value) / 1000);
    }

    return { state, refusal, drawn, endedAt, isSilent, ageSeconds };
}
