import type { FormDataConvertible } from '@inertiajs/core';
import { onBeforeUnmount, ref } from 'vue';
import type { AgentOptionData } from '@generated/types/chat';
import { keyedPost } from '@kit/keyedPost';
import { followPage } from '@kit/followPage';

/**
 * Where a switch this dialog asked for stands: being sent, followed through the page's reads until it is over,
 * uncertain after an answer that never came (still followed, never sent again), over, or refused.
 */
export type SwitchState = 'idle' | 'sending' | 'following' | 'uncertain' | 'over' | 'refused';

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
    let following: { stop: () => void } | undefined;
    let followedSwitchId: string | null = null;

    function begin(requestId: string, url: string, choice: Record<string, FormDataConvertible>): void {
        state.value = 'sending';
        refusal.value = null;
        progress.value = 'Switch requested';
        keyedPost(url, choice, requestId, {
            onAccepted: () => follow(),
            onRefused: (reason) => {
                refusal.value = reason;
                state.value = 'refused';
            },
            onUncertain: () => {
                // The answer never came: the switch is followed by reading the page, never sent again.
                state.value = 'uncertain';
                follow();
            },
        });
    }

    /**
     * Retries or rechecks the agent's switch under one key: Retrying or Checking shows at once, and the switch is then
     * followed from the page until it is over. While one is out, another press does nothing.
     */
    function retry(url: string, key: string, label: 'Retrying' | 'Checking'): void {
        if (isOut()) {
            return;
        }

        followedSwitchId = agent().switchId;
        state.value = 'sending';
        refusal.value = null;
        progress.value = label;
        keyedPost(url, {}, key, {
            onAccepted: () => (following = followPage(showSwitch)),
            onRefused: (reason) => {
                refusal.value = reason;
                state.value = 'refused';
            },
            onUncertain: () => {
                state.value = 'uncertain';
                following = followPage(showSwitch);
            },
        });
    }

    function isOut(): boolean {
        return state.value === 'sending' || state.value === 'following' || state.value === 'uncertain';
    }

    /**
     * Whether the page's switch is the one this operation follows: the same one for a retry, a new one for a switch.
     */
    function isFollowed(switchId: string | null): boolean {
        return followedSwitchId === null ? switchId !== null && switchId !== switchBefore : switchId === followedSwitchId;
    }

    /**
     * Shows the agent's switch as the page has it now, and answers whether it is over.
     */
    function showSwitch(): boolean {
        const shown = agent();

        if (!isFollowed(shown.switchId)) {
            return false;
        }

        progress.value = shown.switchStageLabel;
        state.value = shown.isSwitchOver ? 'over' : 'following';

        return shown.isSwitchOver;
    }

    function follow(): void {
        if (!isOpen || showSwitch()) {
            return;
        }

        following = followPage(showSwitch);
    }

    function stop(): void {
        isOpen = false;
        following?.stop();
    }

    onBeforeUnmount(stop);

    return { state, progress, refusal, begin, retry, isOut, stop };
}
