<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import Button from '@kit/Button';
import { onPurge } from '@kit/protectedView';
import Icon from '@kit/Icon';
import { useComposerHeight } from './composables/useComposerHeight';
import { useConversationIntents, type ReplyTarget } from './composables/useConversationIntents';
import { useMessageDrafts } from './composables/useMessageDrafts';

/**
 * Posts in the chat with the chosen agent, at the chat's own inbox (doc 4, 6.5). The text is the draft of this chat,
 * so browsing other chats, a switch or a reload keeps it; a send names the session the user saw the agent run, is
 * refused when the agent runs another one by then, and clears only its own draft, only if it was not typed on since.
 */
const props = defineProps<{
    draftKey: string;
    agent: string | null;
    addresseeName: string | null;
    sessionId: string | null;
    sessionGeneration: number;
    inboxId: string;
    replyingTo: ReplyTarget | null;
    conversationProp: string;
}>();

const emit = defineEmits<{ replied: [] }>();

const drafts = useMessageDrafts();
const body = ref('');
const textarea = ref<HTMLTextAreaElement | null>(null);
const hasText = computed(() => body.value.trim() !== '');

useComposerHeight(textarea, body);

// The stored draft is read in the browser only, after the server-rendered page has been taken over; the composer is
// mounted only once its conversation is revealed. A denial or sign-out empties it, which removes the stored draft.
onMounted(() => (body.value = drafts.read(props.draftKey)));
onBeforeUnmount(onPurge(() => (body.value = '')));

watch(
    () => props.draftKey,
    (key) => (body.value = drafts.read(key)),
);
watch(body, (text) => drafts.write(props.draftKey, text));
// A refused send put back into the draft shows in the field.
watch(
    () => drafts.read(props.draftKey),
    (text) => {
        if (text !== body.value) {
            body.value = text;
        }
    },
);

/**
 * Sends the draft through the conversation's owner: the text clears and a Sending bubble shows at once, and the
 * owner settles it; a reply goes to the message at the version shown, so a stale one is refused with its text kept.
 */
function submit(): void {
    if (!hasText.value) {
        return;
    }

    const owner = useConversationIntents(props.draftKey);
    const draft = {
        draftKey: props.draftKey,
        text: body.value,
        agent: props.agent,
        expectedSessionId: props.sessionId,
        expectedGeneration: props.sessionGeneration,
        inboxId: props.inboxId,
    };
    const replyingTo = props.replyingTo;
    const intent = replyingTo === null
        ? owner.beginSend(draft)
        : owner.beginReply(draft, replyingTo, replyingTo.stateVersion);
    body.value = drafts.read(props.draftKey);

    if (replyingTo !== null) {
        emit('replied');
    }

    owner.submit(intent, props.conversationProp);
}

function sendOnEnter(event: KeyboardEvent): void {
    if (event.shiftKey || event.isComposing) {
        return;
    }

    event.preventDefault();
    submit();
}
</script>

<template>
    <form
        class="flex flex-col gap-1.5 rounded-composer border border-border-2 px-3 py-2.5"
        @submit.prevent="submit"
    >
        <p class="text-small text-text-3">
            <template v-if="addresseeName !== null">
                To {{ addresseeName }}<template v-if="sessionId === null">, no session</template>
            </template>
            <template v-else>To everyone in this chat</template>
        </p>
        <template v-if="replyingTo">
            <p class="text-small text-text-3">
                Replying to: {{ replyingTo.body.slice(0, 80) }}
            </p>
        </template>
        <textarea
            ref="textarea"
            v-model="body"
            name="body"
            rows="3"
            placeholder="Write a message"
            aria-label="Write a message"
            class="resize-none border-0 bg-transparent p-0 text-body leading-[1.45] text-text transition-[height] duration-160 outline-none placeholder:text-text-3"
            @keydown.enter="sendOnEnter"
        />
        <div class="flex items-center gap-2">
            <span
                class="text-text-4"
                title="Attaching files is not available yet"
                aria-label="Attaching files is not available yet"
            >
                <Icon name="docs" :size="16" />
            </span>
            <span class="ml-auto">
                <template v-if="hasText">
                    <Button
                        type="submit"
                        size="small"
                        variant="primary"
                        >Send</Button
                    >
                </template>
                <template v-else>
                    <Button
                        type="button"
                        size="small"
                        variant="bordered"
                        disabled
                        title="Dumping files is not available yet"
                        >Dump files</Button
                    >
                </template>
            </span>
        </div>
    </form>
</template>
