<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue';
import Button from '@kit/Button';
import { keyedPost } from '@kit/keyedPost';
import Modal from '@kit/Modal';
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
const reasonField = useTemplateRef<HTMLTextAreaElement>('reasonField');
const key = ref(crypto.randomUUID());
const search = ref('');
const chosen = ref(props.prerequisite ?? '');
const reason = ref('');
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
    <Modal :is-open="true" :title="title" @close="emit('close')">
        <div class="flex flex-col gap-3">
            <p class="text-body text-text-2">{{ effect }}</p>
            <template v-if="change === 'add'">
                <form class="flex gap-2" role="search" @submit.prevent="find">
                    <input
                        v-model="search"
                        type="search"
                        aria-label="Find a task"
                        placeholder="Find a task"
                        class="h-[30px] flex-1 rounded-control border border-border-2 bg-bg-2 px-2.5 text-body text-text"
                    />
                    <Button type="submit" variant="bordered" size="small">Find</Button>
                </form>
                <fieldset class="flex flex-col gap-1">
                    <legend class="text-small text-text-3">Prerequisite</legend>
                    <template v-if="choices.length === 0">
                        <p class="text-small text-text-3">Search for the task to wait for.</p>
                    </template>
                    <template v-for="choice in choices" :key="choice.number">
                        <label class="flex items-center gap-2 text-small">
                            <input v-model="chosen" type="radio" name="prerequisite" :value="choice.number" />
                            <span>Task {{ choice.number }} · {{ choice.title }}</span>
                        </label>
                    </template>
                </fieldset>
            </template>
            <template v-if="change === 'waive'">
                <label class="flex flex-col gap-1 text-small text-text-2">
                    <span>Reason</span>
                    <textarea
                        ref="reasonField"
                        v-model="reason"
                        rows="3"
                        required
                        class="rounded-control border border-border-2 bg-bg-2 px-2.5 py-1.5 text-body text-text"
                    />
                </label>
            </template>
            <template v-if="refusal !== ''">
                <p role="alert" class="text-small text-danger">{{ refusal }}</p>
            </template>
            <template v-if="status === 'unknown'">
                <p role="status" class="text-small text-text-2">
                    Outcome unknown: the change may or may not have been made.
                </p>
            </template>
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
    </Modal>
</template>
