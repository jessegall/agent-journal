import { onBeforeUnmount, ref, watch } from 'vue';
import type { AgentOptionData } from '@generated/types/chat';
import { keyedPost } from '@kit/keyedPost';
import { appliedReadGeneration, markDirty } from '@kit/usePageChanges';

/**
 * Where a switch this dialog asked for stands: being sent, followed through the page's reads until it is over,
 * uncertain after an answer that never came (still followed, never sent again), over, or refused.
 */
export type SwitchState = 'idle' | 'sending' | 'following' | 'uncertain' | 'over' | 'refused';

const FOLLOW_PAUSE_MS = 2000;

/**
 * One switch of one dialog: sent once through Inertia under its request key, then followed by reading the page
 * again, one read at a time, until the agent's switch is over. Closing the dialog stops it, so a late read can never
 * change the next dialog.
 */
export function useSwitchOperation(agent: () => AgentOptionData) {
    const state = ref<SwitchState>('idle');
    const progress = ref<string | null>(null);
    const refusal = ref<string | null>(null);
    const switchBefore = agent().switchId;
    let isOpen = true;
    let awaitedRead = 0;
    let pause: ReturnType<typeof setTimeout> | undefined;

    function begin(requestId: string, url: string, choice: Record<string, unknown>): void {
        state.value = 'sending';
        refusal.value = null;
        progress.value = 'Switch requested';
        keyedPost(url, choice, requestId, {
            onAccepted: () => follow(),
            onRefused: (reason) => {
                refusal.value = reason;
                state.value = 'refused';
            },
            onUncertain: () => markUncertain(),
        });
    }

    /**
     * The answer never came: the switch is followed by reading the page, never sent again.
     */
    function markUncertain(): void {
        state.value = 'uncertain';
        follow();
    }

    /**
     * Shows the agent's switch as the page has it now, and asks for the next read unless it is over.
     */
    function follow(): void {
        if (!isOpen) {
            return;
        }

        const shown = agent();

        if (shown.switchId !== null && shown.switchId !== switchBefore) {
            progress.value = shown.switchStageLabel;

            if (shown.isSwitchOver) {
                state.value = 'over';

                return;
            }

            state.value = 'following';
        }

        awaitedRead = markDirty('write');
    }

    // The next read is asked for only once the previous one answered, after a short pause.
    watch(appliedReadGeneration, (applied) => {
        if (!isOpen || awaitedRead === 0 || applied < awaitedRead) {
            return;
        }

        awaitedRead = 0;
        pause = setTimeout(follow, FOLLOW_PAUSE_MS);
    });

    function stop(): void {
        isOpen = false;
        clearTimeout(pause);
    }

    onBeforeUnmount(stop);

    return { state, progress, refusal, begin, stop };
}
