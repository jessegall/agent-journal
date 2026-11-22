// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, nextTick, ref } from 'vue';
import type { ChatEventsPageData, ChatMessageData, ChatRowsPageData, ConversationData } from '@generated/types/chat';
import { notifyChatAccessEnded } from '@kit/chatAccess';
import { useChatTimeline } from './useChatTimeline';
import type { ChatTimelineClient, ChatTimelineView } from './useChatTimeline';

function row(sequence: number): ChatMessageData {
    return {
        id: `m${sequence}`,
        sequence,
        speaker: { actor: 'user:ada', label: 'Ada', driver: null },
        readByMe: false,
        stateVersion: 1,
    } as ChatMessageData;
}

function conversationOf(rows: ChatMessageData[], olderCursor: string | null = null): ConversationData {
    return {
        inboxId: 'design',
        viewer: 'user:bea',
        participants: [],
        latestSequence: rows.length === 0 ? 0 : rows[rows.length - 1].sequence,
        olderCursor,
        messages: rows,
    } as unknown as ConversationData;
}

/**
 * A server whose reads wait until the test releases them, so a read can still be out when the room is lost.
 */
function heldClient() {
    const releases: (() => void)[] = [];
    const answer = <Page>(page: Page) => new Promise<Page>((resolve) => releases.push(() => resolve(page)));
    const client: ChatTimelineClient = {
        events: () =>
            answer<ChatEventsPageData>({ accessEnded: false, events: [], cursor: 'cursor-1', watermark: 12 }),
        rows: () => answer<ChatRowsPageData>({ messages: [row(10), row(11), row(12)], olderCursor: null }),
    };

    return { client, releaseAll: () => releases.splice(0).forEach((release) => release()) };
}

function mountTimeline(conversation: ReturnType<typeof ref<ConversationData | undefined>>, client: ChatTimelineClient) {
    let view: ChatTimelineView | undefined;
    mount(defineComponent({
        setup() {
            view = useChatTimeline(conversation as never, client);

            return () => null;
        },
    }));

    return view as ChatTimelineView;
}

describe('useChatTimeline', () => {
    it('clears a lost room with rows buffered, ignores the late read, and a rejoin starts from a fresh snapshot', async () => {
        const conversation = ref<ConversationData | undefined>(conversationOf([row(10)]));
        const server = heldClient();
        const view = mountTimeline(conversation, server.client);
        await nextTick();

        conversation.value = conversationOf([row(12)], 'older-1');
        await nextTick();
        expect(view.messages.value.map((shown) => shown.id)).toEqual(['m10']);

        notifyChatAccessEnded('design');
        server.releaseAll();
        await nextTick();
        await nextTick();

        expect(view.accessEnded.value).toBe(true);
        expect(view.messages.value).toEqual([]);

        conversation.value = conversationOf([row(10), row(11), row(12)]);
        await nextTick();

        expect(view.accessEnded.value).toBe(false);
        expect(view.messages.value.map((shown) => shown.id)).toEqual(['m10', 'm11', 'm12']);
    });
});
