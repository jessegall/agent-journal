<script setup lang="ts">
import { computed, ref } from 'vue';
import Button from '@kit/Button';
import { keyedPost } from '@kit/keyedPost';
import Dialog from '@kit/Dialog';
import SendNotices from '@kit/SendNotices';
import UnknownOutcomeActions from '@kit/UnknownOutcomeActions';
import OptionCards from '@kit/OptionCards';
import { useWindowReload } from '@kit/useWindowQuery';
import { assignWork, reassignWork } from '@generated/routes/plans';
import type { PlanWorkPreviewData } from '@generated/types/plans';
import { useHostProp } from '@kit/hostProp';

/**
 * Assigns or reassigns a plan's work in a dialog: the dispatcher chooses an eligible worker, and the preview names the
 * scope, the holders and what moves; over the limit the confirm is off. A refusal keeps the dialog open with the
 * domain's words and fresh choices; nothing here starts a worker.
 */
const props = defineProps<{
    number: string;
    work: PlanWorkPreviewData;
    holder: { type: string; id: string; name: string; reference: string } | undefined;
}>();
const emit = defineEmits<{ close: [] }>();

const pane = useHostProp();
const reload = useWindowReload();
const chosen = ref<string | null>(null);
const recipientOptions = computed(() =>
    props.work.recipients.map((option) => ({
        value: `${option.type}:${option.id}`,
        title: option.name,
        aside: '',
        description: '',
    })),
);
const refusal = ref('');
const status = ref<'choosing' | 'sending' | 'unknown'>('choosing');
const key = crypto.randomUUID();

const recipient = computed(() => props.work.recipients.find((option) => `${option.type}:${option.id}` === chosen.value));
const scope = computed(
    () => `Plan ${props.number}: ${props.work.phaseCount} phases, ${props.work.taskCount} tasks`,
);
const moves = computed(
    () => `${props.work.movingTasks} unfinished tasks move; ${props.work.stayingTasks} finished stay`,
);

function send(): void {
    const target = recipient.value;

    if (target === undefined) {
        return;
    }

    status.value = 'sending';
    refusal.value = '';
    const fields: Record<string, string> = { recipient_type: target.type, recipient_id: target.id };

    if (props.holder !== undefined) {
        fields.expected_reference = props.holder.reference;
        fields.expected_holder_type = props.holder.type;
        fields.expected_holder_id = props.holder.id;
    }

    keyedPost(
        (props.holder === undefined ? assignWork : reassignWork).url({ plan: props.number }),
        fields,
        key,
        {
            onAccepted: () => emit('close'),
            onRefused: (message) => {
                status.value = 'choosing';
                chosen.value = null;
                refusal.value = message ?? 'This was refused.';
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
        :title="holder === undefined ? `Assign plan ${number}` : `Reassign plan ${number}`"
        @close="emit('close')"
    >
        <div class="flex flex-col gap-3">
            <fieldset class="flex flex-col gap-1">
                <legend class="text-small text-text-3">Worker</legend>
                <template v-if="work.recipients.length === 0">
                    <p class="text-small text-text-3">No worker can take this work now.</p>
                </template>
                <OptionCards v-model="chosen" label="Worker" :options="recipientOptions" />
            </fieldset>
            <dl class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-small">
                <dt class="text-text-3">Scope</dt>
                <dd class="text-text-2">{{ scope }}</dd>
                <dt class="text-text-3">Held by</dt>
                <dd class="text-text-2">{{ holder?.name ?? 'Nobody' }}</dd>
                <dt class="text-text-3">Goes to</dt>
                <dd class="text-text-2">{{ recipient?.name ?? 'Choose a worker' }}</dd>
                <dt class="text-text-3">Moves</dt>
                <dd class="text-text-2">{{ moves }}</dd>
            </dl>
            <template v-if="work.isOverLimit">
                <p role="alert" class="text-small text-danger">This work unit exceeds the 1,000-record limit.</p>
            </template>
            <SendNotices :refusal="refusal" :is-unknown="status === 'unknown'" unknown="the work may or may not have moved." />
        </div>
        <template #footer>
            <Button @click="emit('close')">Keep it as it is</Button>
            <template v-if="status === 'unknown'">
                <UnknownOutcomeActions
                    check-label="Check plan"
                    @check="reload({}, { onNetworkError: () => false, onHttpException: () => false })"
                    @resend="send"
                />
            </template>
            <template v-else>
                <Button
                    variant="primary"
                    :pending="status === 'sending'"
                    :disabled="work.isOverLimit || recipient === undefined"
                    @click="send"
                    >{{ holder === undefined ? 'Assign' : 'Reassign' }}</Button
                >
            </template>
        </template>
    </Dialog>
</template>
