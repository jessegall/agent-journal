<script setup lang="ts">
import Textarea from '@kit/Textarea';
import { nextTick, ref, useTemplateRef } from 'vue';
import Button from '@kit/Button';
import { keyedPost } from '@kit/keyedPost';
import Dialog from '@kit/Dialog';
import SendNotices from '@kit/SendNotices';
import UnknownOutcomeActions from '@kit/UnknownOutcomeActions';
import { useWindowReload } from '@kit/useWindowQuery';
import { cancelPlan as cancelRoute, finishPlan as finishRoute } from '@generated/routes/plans';
import type { PlanStatus } from '@generated/types/plans';
import { useHostProp } from '@kit/hostProp';

/**
 * Cancels a plan with a reason or finishes it with a note, in a dialog that names it, posting the revision and state
 * read on screen. A refusal closes the dialog with the domain's words and reads the plan again; a lost answer shows
 * Outcome unknown and Check plan.
 */
const props = defineProps<{
    change: 'cancel' | 'finish';
    number: string;
    revision: number;
    state: PlanStatus;
}>();
const emit = defineEmits<{ close: []; refused: [message: string] }>();

const pane = useHostProp();
const reload = useWindowReload();
const textField = useTemplateRef<InstanceType<typeof Textarea>>('textField');
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
    <Dialog
        :open="true"
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
                <Textarea ref="textField" v-model="text" :rows="3" />
            </label>
            <SendNotices :refusal="refusal" :is-unknown="status === 'unknown'" unknown="the plan may or may not have changed." />
        </div>
        <template #footer>
            <Button @click="emit('close')">Keep the plan as it is</Button>
            <template v-if="status === 'unknown'">
                <UnknownOutcomeActions
                    check-label="Check plan"
                    @check="reload({}, { onNetworkError: () => false, onHttpException: () => false })"
                    @resend="send"
                />
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
    </Dialog>
</template>
