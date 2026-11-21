<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { computed, onMounted, ref, watch } from 'vue';
import Button from '@kit/Button';
import FormErrors from '@kit/FormErrors';
import Icon from '@kit/Icon';
import { useComposerHeight } from './composables/useComposerHeight';
import { useMessageDrafts } from './composables/useMessageDrafts';
import { formSendingHooks } from '@kit/usePageChanges';
import { reply as replyRoute, send as sendRoute } from '@generated/routes/chat';
import type { MessageInput } from '@generated/types/chat';
import type { MessageView } from '@kit/CoreTypes';

/**
 * Asks the chosen agent, from the user's inbox to the agent's (doc 4, 6.5). The text is the draft of this agent, so
 * browsing other agents, a switch or a reload keeps it; a send names the session the user saw the agent run, is
 * refused when the agent runs another one by then, and clears only its own draft, only if it was not typed on since.
 */
const props = defineProps<{
    draftKey: string;
    agent: string;
    agentName: string;
    sessionId: string | null;
    sessionGeneration: number;
    sourceInboxId: string;
    destinationInboxId: string;
    replyingTo: MessageView | null;
}>();

const emit = defineEmits<{ replied: [] }>();

const drafts = useMessageDrafts();
const body = ref('');
const textarea = ref<HTMLTextAreaElement | null>(null);
const form = useForm<MessageInput>({
    body: '',
    agent: props.agent,
    expectedSessionId: props.sessionId,
    expectedGeneration: props.sessionGeneration,
    sourceInboxId: props.sourceInboxId,
    destinationInboxId: props.destinationInboxId,
});
const hasText = computed(() => body.value.trim() !== '');

useComposerHeight(textarea, body);

// The stored draft is read in the browser only, after the server-rendered page has been taken over.
onMounted(() => (body.value = drafts.read(props.draftKey)));

watch(
    () => props.draftKey,
    (key) => {
        body.value = drafts.read(key);
        form.clearErrors();
    },
);
watch(body, (text) => drafts.write(props.draftKey, text));

function submit(): void {
    if (!hasText.value || form.processing) {
        return;
    }

    const sent = {
        key: props.draftKey,
        body: body.value,
        agent: props.agent,
        expectedSessionId: props.sessionId,
        expectedGeneration: props.sessionGeneration,
        sourceInboxId: props.sourceInboxId,
        destinationInboxId: props.destinationInboxId,
        replyingTo: props.replyingTo,
    };
    const hooks = {
        preserveScroll: true,
        ...formSendingHooks(),
        onSuccess: () => {
            drafts.clearSent(sent.key, sent.body);

            if (props.draftKey === sent.key) {
                body.value = drafts.read(sent.key);
            }

            if (sent.replyingTo !== null) {
                emit('replied');
            }
        },
    };

    // A reply goes to the message at the version shown; a stale one is refused and the draft stays.
    if (sent.replyingTo !== null) {
        form.transform(() => ({
            messageId: sent.replyingTo?.id,
            stateVersion: sent.replyingTo?.stateVersion,
            body: sent.body,
            agent: sent.agent,
        })).submit(replyRoute(), hooks);

        return;
    }

    form.transform(() => ({
        body: sent.body,
        agent: sent.agent,
        expectedSessionId: sent.expectedSessionId,
        expectedGeneration: sent.expectedGeneration,
        sourceInboxId: sent.sourceInboxId,
        destinationInboxId: sent.destinationInboxId,
    })).submit(sendRoute(), hooks);
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
            To {{ agentName }}<template v-if="sessionId === null">, no session</template>
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
            placeholder="Message the agent"
            aria-label="Message the agent"
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
                        :pending="form.processing"
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
        <FormErrors :errors="form.errors" />
    </form>
</template>
