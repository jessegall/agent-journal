<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue';
import Button from '@kit/Button';
import { keyedPost } from '@kit/keyedPost';
import Modal from '@kit/Modal';
import { useWindowReload } from '@kit/useWindowQuery';
import { cancel as cancelRoute, finish as finishRoute } from '@generated/routes/plans';
import type { PlanState } from '@generated/types/plans';
import { useHostProp } from '@/framework/hostProp';

/**
 * Cancels or finishes a plan in a dialog that names it: cancelling asks a reason and says its tasks and assignments
 * keep their state; finishing asks a note. The post carries the revision and state read on screen; a refusal, such as
 * a plan that moved on, closes the dialog with the domain's words and reads the plan again; a lost answer shows
 * Outcome unknown and Check plan, and the same request goes again only when chosen.
 */
const props = defineProps<{
    change: 'cancel' | 'finish';
    number: string;
    revision: number;
    state: PlanState;
}>();
const emit = defineEmits<{ close: []; refused: [message: string] }>();

const pane = useHostProp();
const reload = useWindowReload();
const textField = useTemplateRef<HTMLTextAreaElement>('textField');
const text = ref('');
const refusal = ref('');
const status = ref<'editing' | 'sending' | 'unknown'>('editing');
const key = crypto.randomUUID();

async function send(): Promise<void> {
    if (text.value.trim() === '') {
        refusal.value = props.change === 'cancel' ? 'Give the reason.' : 'Say what the plan achieved.';
        await nextTick();
        textField.value?.focus();

        return;
    }

    status.value = 'sending';
    keyedPost(
        (props.change === 'cancel' ? cancelRoute : finishRoute).url({ plan: props.number }),
        { revision: String(props.revision), state: props.state, text: text.value },
        key,
        {
            onAccepted: () => emit('close'),
            onRefused: (message) => {
                emit('refused', message ?? 'This was refused.');
                reload({}, { onNetworkError: () => false, onHttpException: () => false });
            },
            onUncertain: () => {
                status.value = 'unknown';
            },
        },
        [pane],
    );
}
</script>

<template>
    <Modal
        :is-open="true"
        :title="change === 'cancel' ? `Cancel plan ${number}` : `Finish plan ${number}`"
        @close="emit('close')"
    >
        <div class="flex flex-col gap-3">
            <p class="text-body text-text-2">
                {{
                    change === 'cancel'
                        ? `Plan ${number} will end as cancelled. Its tasks and assignments keep their state.`
                        : `Plan ${number} will end as done; every task in it is finished or cancelled.`
                }}
            </p>
            <label class="flex flex-col gap-1 text-small text-text-2">
                <span>{{ change === 'cancel' ? 'Reason' : 'What the plan achieved' }}</span>
                <textarea
                    ref="textField"
                    v-model="text"
                    rows="3"
                    class="rounded-control border border-border-2 bg-bg-2 px-2.5 py-1.5 text-body text-text"
                />
            </label>
            <template v-if="refusal !== ''">
                <p role="alert" class="text-small text-danger">{{ refusal }}</p>
            </template>
            <template v-if="status === 'unknown'">
                <p role="status" class="text-small text-text-2">
                    Outcome unknown: the plan may or may not have changed.
                </p>
            </template>
        </div>
        <template #footer>
            <Button @click="emit('close')">Keep the plan as it is</Button>
            <template v-if="status === 'unknown'">
                <Button variant="bordered" @click="reload({}, { onNetworkError: () => false, onHttpException: () => false })"
                    >Check plan</Button
                >
                <Button variant="bordered" @click="send">Send again</Button>
            </template>
            <template v-else>
                <Button
                    :variant="change === 'cancel' ? 'danger' : 'primary'"
                    :pending="status === 'sending'"
                    @click="send"
                    >{{ change === 'cancel' ? 'Cancel plan' : 'Finish plan' }}</Button
                >
            </template>
        </template>
    </Modal>
</template>
