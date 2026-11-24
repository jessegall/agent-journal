<script setup lang="ts">
import Input from '@kit/Input';
import Textarea from '@kit/Textarea';
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue';
import Button from '@kit/Button';
import { keyedPost } from '@kit/keyedPost';
import Dialog from '@kit/Dialog';
import SendNotices from '@kit/SendNotices';
import OptionCards from '@kit/OptionCards';
import { useWindowReload } from '@kit/useWindowQuery';
import { addWait, removeWait, waiveWait } from '@generated/routes/tasks';
import type { TaskWaitChoiceData } from '@generated/types/tasks';
import { useHostProp } from '@kit/hostProp';

/**
 * One change of a task's waits in a dialog that names the task and the effect: adding a prerequisite chosen by a
 * search, removing a wait, or waiving one with its required reason. It posts once under its request key and reloads
 * only its window's prop; a refusal stays in the dialog, a missing reason focuses the reason, and a lost answer shows
 * Outcome unknown with Check task, never a retry.
 */
const props = defineProps<{
    change: 'add' | 'remove' | 'waive';
    number: string;
    prerequisite: string | undefined;
    choices: TaskWaitChoiceData[];
}>();
const emit = defineEmits<{ close: [] }>();

const reload = useWindowReload();
const pane = useHostProp();
const reasonField = useTemplateRef<InstanceType<typeof Textarea>>('reasonField');
const key = ref(crypto.randomUUID());
const search = ref('');
const chosen = ref(props.prerequisite ?? '');
const reason = ref('');
const choiceOptions = computed(() =>
    props.choices.map((choice) => ({
        value: choice.number,
        title: `Task ${choice.number}`,
        aside: '',
        description: choice.title,
    })),
);
const refusal = ref('');
const status = ref<'editing' | 'sending' | 'unknown'>('editing');

watch(
    () => props.prerequisite,
    (number) => (chosen.value = number ?? ''),
);

const title = computed(
    () =>
        ({
            add: `Add a prerequisite to task ${props.number}`,
            remove: `Remove the wait of task ${props.number}`,
            waive: `Waive the wait of task ${props.number}`,
        })[props.change],
);
const effect = computed(
    () =>
        ({
            add: `Task ${props.number} will not be ready until the chosen task is finished.`,
            remove: `Task ${props.number} will no longer wait for task ${chosen.value}.`,
            waive: `Task ${props.number} will no longer wait for task ${chosen.value}; the reason is kept with the wait.`,
        })[props.change],
);

function find(): void {
    reload({ section: 'waits', prerequisite_q: search.value }, { onNetworkError: () => false, onHttpException: () => false });
}

function routeOf(): string {
    const task = { task: props.number };

    return { add: addWait, remove: removeWait, waive: waiveWait }[props.change].url(task);
}

function send(): void {
    refusal.value = '';
    status.value = 'sending';
    keyedPost(
        routeOf(),
        props.change === 'waive' ? { prerequisite: chosen.value, reason: reason.value } : { prerequisite: chosen.value },
        key.value,
        {
            onAccepted: () => emit('close'),
            onRefused: async (message) => {
                status.value = 'editing';
                refusal.value = message ?? 'This change was refused.';

                if (props.change === 'waive' && reason.value.trim() === '') {
                    await nextTick();
                    reasonField.value?.focus();
                }
            },
            onUncertain: () => {
                status.value = 'unknown';
            },
        },
        [pane],
    );
}

function checkTask(): void {
    reload({ section: 'waits' }, { onNetworkError: () => false, onHttpException: () => false });
    emit('close');
}
</script>

<template>
    <Dialog :open="true" :title="title" @close="emit('close')">
        <div class="flex flex-col gap-3">
            <p class="text-body text-text-2">{{ effect }}</p>
            <template v-if="change === 'add'">
                <form class="flex gap-2" role="search" @submit.prevent="find">
                    <Input
                        v-model="search"
                        type="search"
                        aria-label="Find a task"
                        placeholder="Find a task"
                        class="flex-1"
                    />
                    <Button type="submit" variant="bordered" size="small">Find</Button>
                </form>
                <fieldset class="flex flex-col gap-1">
                    <legend class="text-small text-text-3">Prerequisite</legend>
                    <template v-if="choices.length === 0">
                        <p class="text-small text-text-3">Search for the task to wait for.</p>
                    </template>
                    <OptionCards
                        :model-value="chosen === '' ? null : chosen"
                        label="Prerequisite"
                        :options="choiceOptions"
                        @update:model-value="chosen = $event ?? ''"
                    />
                </fieldset>
            </template>
            <template v-if="change === 'waive'">
                <label class="flex flex-col gap-1 text-small text-text-2">
                    <span>Reason</span>
                    <Textarea ref="reasonField" v-model="reason" :rows="3" required />
                </label>
            </template>
            <SendNotices :refusal="refusal" :is-unknown="status === 'unknown'" unknown="the change may or may not have been made." />
        </div>
        <template #footer>
            <Button @click="emit('close')">Cancel</Button>
            <template v-if="status === 'unknown'">
                <Button variant="bordered" @click="checkTask">Check task</Button>
            </template>
            <template v-else>
                <Button
                    variant="primary"
                    :pending="status === 'sending'"
                    :disabled="chosen === ''"
                    @click="send"
                    >{{ { add: 'Add prerequisite', remove: 'Remove wait', waive: 'Waive wait' }[change] }}</Button
                >
            </template>
        </template>
    </Dialog>
</template>
