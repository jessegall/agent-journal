// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, reactive, ref } from 'vue';
import type { AgentOptionData } from '@generated/types/chat';

type PostOptions = {
    headers: Record<string, string>;
    onSuccess: () => void;
    onError: (errors: Record<string, string>) => void;
    onNetworkError: () => boolean;
};

const posts: Array<{ url: string; options: PostOptions }> = [];
const applied = ref(0);
let marked = 0;

vi.mock('@inertiajs/vue3', () => ({
    router: { post: (url: string, _choice: unknown, options: PostOptions) => posts.push({ url, options }) },
}));
vi.mock('@kit/usePageChanges', () => ({ appliedReadGeneration: applied, markDirty: () => ++marked }));

const { useSwitchOperation } = await import('./useSwitchOperation');

const agent = reactive({ switchId: null, switchStageLabel: null, isSwitchOver: true } as unknown as AgentOptionData);

function mountSwitch() {
    let operation: ReturnType<typeof useSwitchOperation> | undefined;
    const dialog = mount(defineComponent({
        setup: () => {
            operation = useSwitchOperation(() => agent);

            return () => h('div');
        },
    }));

    return { dialog, operation: operation as ReturnType<typeof useSwitchOperation> };
}

function showSwitch(label: string, isOver: boolean): void {
    Object.assign(agent, { switchId: 'switch-1', switchStageLabel: label, isSwitchOver: isOver });
}

describe('useSwitchOperation', () => {
    beforeEach(() => {
        posts.length = 0;
        marked = 0;
        applied.value = 0;
        Object.assign(agent, { switchId: null, switchStageLabel: null, isSwitchOver: true });
        vi.useFakeTimers();
    });

    it('settles on an answer that shows the switch over, with no further read', () => {
        const { operation } = mountSwitch();

        operation.begin('request-1', '/profiles/main/switch', {});
        showSwitch('Confirmed', true);
        posts[0].options.onSuccess();

        expect(posts[0].options.headers['Idempotency-Key']).toBe('request-1');
        expect(operation.state.value).toBe('over');
        expect(operation.progress.value).toBe('Confirmed');
        expect(marked).toBe(0);
    });

    it('recovers a lost answer by reading the page, one read at a time, and never sends again', async () => {
        const { operation } = mountSwitch();
        operation.begin('request-1', '/profiles/main/switch', {});

        posts[0].options.onNetworkError();
        expect(operation.state.value).toBe('uncertain');
        expect(marked).toBe(1);
        showSwitch('Stopping', false);
        applied.value = 1;
        await vi.advanceTimersByTimeAsync(2000);
        expect(operation.progress.value).toBe('Stopping');
        expect(marked).toBe(2);
        showSwitch('Confirmed', true);
        applied.value = 2;
        await vi.advanceTimersByTimeAsync(2000);

        expect(operation.state.value).toBe('over');
        expect(posts).toHaveLength(1);
    });

    it('ignores a late read once its dialog closed', async () => {
        const { dialog, operation } = mountSwitch();
        operation.begin('request-1', '/profiles/main/switch', {});
        posts[0].options.onSuccess();
        dialog.unmount();

        showSwitch('Confirmed', true);
        applied.value = marked;
        await vi.advanceTimersByTimeAsync(2000);

        expect(operation.state.value).not.toBe('over');
    });

    it('shows the server reason of a refused switch', () => {
        const { operation } = mountSwitch();
        operation.begin('request-1', '/profiles/main/switch', {});

        posts[0].options.onError({ switch: 'The account needs to sign in again.' });

        expect(operation.state.value).toBe('refused');
        expect(operation.refusal.value).toBe('The account needs to sign in again.');
    });
});
