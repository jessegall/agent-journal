<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue';
import Button from '@kit/Button';
import { keyedPost } from '@kit/keyedPost';
import Modal from '@kit/Modal';
import { useWindowReload } from '@kit/useWindowQuery';
import { block, cancel } from '@generated/routes/tasks';
import { useHostProp } from '@/framework/hostProp';

/**
 * Blocks or cancels one task in a dialog that names it: a reason is required, a blank one keeps the dialog open with
 * the focus on the reason; the post carries the revision and run read on screen and reloads only the window's prop.
 * A refusal, such as a task that moved on or another worker's run, closes the dialog with the domain's words and reads
 * the task again, so a fresh confirmation is needed; a lost answer shows Outcome unknown and Check task, and the same
 * request goes again only when chosen.
 */
const props = defineProps<{
    change: 'block' | 'cancel';
    number: string;
    revision: number;
    runNumber: number;
}>();
const emit = defineEmits<{ close: []; refused: [message: string] }>();

const pane = useHostProp();
const reload = useWindowReload();
const reasonField = useTemplateRef<HTMLTextAreaElement>('reasonField');
const reason = ref('');
const refusal = ref('');
const status = ref<'editing' | 'sending' | 'unknown'>('editing');
const key = crypto.randomUUID();

async function focusReason(): Promise<void> {
    await nextTick();
    reasonField.value?.focus();
}

function send(): void {
    if (reason.value.trim() === '') {
        refusal.value = 'Give the reason.';
        void focusReason();

        return;
    }

    refusal.value = '';
    status.value = 'sending';
    const url = (props.change === 'block' ? block : cancel).url({ task: props.number });
    keyedPost(
        url,
        { reason: reason.value, revision: String(props.revision), run: String(props.runNumber) },
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

function checkTask(): void {
    reload({}, { onNetworkError: () => false, onHttpException: () => false });
}
</script>

<template>
    <Modal
        :is-open="true"
        :title="change === 'block' ? `Block task ${number}` : `Cancel task ${number}`"
        @close="emit('close')"
    >
        <div class="flex flex-col gap-3">
            <p class="text-body text-text-2">
                {{
                    change === 'block'
                        ? `Run ${runNumber} of task ${number} will stop and wait; the reason stays with the run.`
                        : `Task ${number} will end as cancelled; the reason is kept with it.`
                }}
            </p>
            <label class="flex flex-col gap-1 text-small text-text-2">
                <span>Reason</span>
                <textarea
                    ref="reasonField"
                    v-model="reason"
                    rows="3"
                    class="rounded-control border border-border-2 bg-bg-2 px-2.5 py-1.5 text-body text-text"
                />
            </label>
            <template v-if="refusal !== ''">
                <p role="alert" class="text-small text-danger">{{ refusal }}</p>
            </template>
            <template v-if="status === 'unknown'">
                <p role="status" class="text-small text-text-2">
                    Outcome unknown: the task may or may not have changed.
                </p>
            </template>
        </div>
        <template #footer>
            <Button @click="emit('close')">Keep the task as it is</Button>
            <template v-if="status === 'unknown'">
                <Button variant="bordered" @click="checkTask">Check task</Button>
                <Button variant="bordered" @click="send">Send again</Button>
            </template>
            <template v-else>
                <Button
                    :variant="change === 'cancel' ? 'danger' : 'primary'"
                    :pending="status === 'sending'"
                    @click="send"
                    >{{ change === 'block' ? 'Block task' : 'Cancel task' }}</Button
                >
            </template>
        </template>
    </Modal>
</template>
