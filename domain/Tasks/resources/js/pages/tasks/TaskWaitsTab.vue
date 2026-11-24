<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { nextTick, onMounted, ref, useTemplateRef, watch } from 'vue';
import Button from '@kit/Button';
import SwitchCase from '@kit/SwitchCase';
import { useWindowReload } from '@kit/useWindowQuery';
import { task as taskRoute } from '@generated/routes/tasks';
import type { TaskWaitActionsData, TaskWaitItemData, TaskWaitsData } from '@generated/types/tasks';
import TaskWaitDialog from './partials/TaskWaitDialog.vue';
import { rememberFollowedWait, takeFollowedWait } from '../../openedWaits';
import { taskStateLook } from '../../taskLooks';

/**
 * A task's waits both ways: Waits for, the tasks it needs finished first, and Holds up, the tasks that need it. Each
 * line says its direction aloud, names the other task with its state and whether the wait is met, and links to it; a
 * removed task stays as unresolved, a task the reader may not see is only a prerequisite they cannot see, and a waived
 * wait says who waived it, when and why. Going back from a task opened here gives its link the focus again. The
 * domain says which changes the caller may make: Add prerequisite, Remove and Waive appear only then, each in a
 * dialog.
 */
const props = defineProps<{
    waits: TaskWaitsData | undefined;
    actions: TaskWaitActionsData | undefined;
    number: string;
}>();

const dialog = ref<{ change: 'add' | 'remove' | 'waive'; prerequisite: string | undefined } | null>(null);

const reload = useWindowReload();
const list = useTemplateRef<HTMLElement>('list');
const status = ref<'loading' | 'shown' | 'failed'>(props.waits === undefined ? 'loading' : 'shown');
const shown = ref<TaskWaitsData | undefined>(props.waits);

watch(
    () => props.waits,
    (waits) => {
        if (waits !== undefined) {
            shown.value = waits;
            status.value = 'shown';
        }
    },
);

function ask(): void {
    status.value = 'loading';
    reload(
        { section: 'waits' },
        {
            onNetworkError: () => {
                status.value = 'failed';

                return false;
            },
            onHttpException: () => {
                status.value = 'failed';

                return false;
            },
        },
    );
}

onMounted(async () => {
    if (shown.value === undefined) {
        ask();
    }

    const followed = takeFollowedWait(props.number);

    if (followed === undefined) {
        return;
    }

    await nextTick();
    list.value?.querySelector<HTMLElement>(`a[data-task-number="${followed}"]`)?.focus();
});

function stateText(item: TaskWaitItemData): string {
    return item.state === undefined ? '' : taskStateLook[item.state].label;
}

function metText(item: TaskWaitItemData): string {
    if (item.waivedAt !== undefined) {
        const when = new Date(item.waivedAt).toLocaleString();

        return `Waived by ${item.waivedByType} ${item.waivedById} on ${when}: ${item.waiveReason}`;
    }

    return item.isSatisfied ? 'Met' : 'Outstanding';
}

function spoken(direction: 'waitsFor' | 'holdsUp', item: TaskWaitItemData): string {
    const others = {
        task: `task ${item.number}`,
        removed: 'a removed task',
        hidden: 'a task you cannot see',
    } as Record<string, string>;
    const other = others[item.type];

    return direction === 'waitsFor'
        ? `Task ${props.number} waits for ${other}`
        : `${other.charAt(0).toUpperCase()}${other.slice(1)} waits for task ${props.number}`;
}
</script>

<template>
    <div ref="list" class="flex flex-col gap-3">
        <template v-if="status === 'failed'">
            <p role="alert" class="flex items-center gap-2 text-small text-text-2">
                <span>The waits could not be read.</span>
                <Button size="small" variant="bordered" @click="ask">Retry</Button>
            </p>
        </template>
        <template v-else-if="status === 'loading' && shown === undefined">
            <p role="status" class="text-small text-text-3">Loading the waits</p>
        </template>
        <template v-if="actions?.reason !== undefined">
            <p class="text-small text-text-3">{{ actions.reason }}</p>
        </template>
        <template v-if="actions?.mayEdit">
            <div>
                <Button
                    size="small"
                    variant="bordered"
                    @click="dialog = { change: 'add', prerequisite: undefined }"
                    >Add prerequisite</Button
                >
            </div>
        </template>
        <template v-if="shown !== undefined">
            <template
                v-for="direction in (['waitsFor', 'holdsUp'] as const)"
                :key="direction"
            >
                <section
                    class="flex flex-col gap-1"
                    :aria-label="direction === 'waitsFor' ? 'Waits for' : 'Holds up'"
                >
                    <h3 class="text-small font-medium text-text-2">
                        {{ direction === 'waitsFor' ? 'Waits for' : 'Holds up' }}
                    </h3>
                    <template v-if="shown[direction].length === 0">
                        <p class="text-small text-text-3">None</p>
                    </template>
                    <ul class="flex flex-col gap-1">
                        <template
                            v-for="(item, index) in shown[direction]"
                            :key="`${item.type}-${item.number ?? index}`"
                        >
                            <li
                                class="flex flex-wrap items-center gap-x-2 text-small"
                                :aria-label="spoken(direction, item)"
                            >
                                <SwitchCase :value="item.type">
                                    <template #task>
                                        <Link
                                            :href="taskRoute.url({ task: item.number ?? '' })"
                                            :data-task-number="item.number"
                                            class="text-text underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text [overflow-wrap:anywhere]"
                                            @click="rememberFollowedWait(number, item.number ?? '')"
                                            >Task {{ item.number }} · {{ item.title }}</Link
                                        >
                                        <span class="text-text-3">{{ stateText(item) }}</span>
                                    </template>
                                    <template #removed>
                                        <span class="text-text-2">Removed task</span>
                                    </template>
                                    <template #default>
                                        <span class="text-text-2">A prerequisite you cannot see</span>
                                    </template>
                                </SwitchCase>
                                <span class="text-text-2">{{ metText(item) }}</span>
                                <template
                                    v-if="direction === 'waitsFor' && item.number !== undefined"
                                >
                                    <template v-if="actions?.mayEdit">
                                        <Button
                                            size="small"
                                            @click="dialog = { change: 'remove', prerequisite: item.number }"
                                            >Remove</Button
                                        >
                                    </template>
                                    <template
                                        v-if="actions?.mayWaive && !item.isSatisfied"
                                    >
                                        <Button
                                            size="small"
                                            @click="dialog = { change: 'waive', prerequisite: item.number }"
                                            >Waive</Button
                                        >
                                    </template>
                                </template>
                            </li>
                        </template>
                    </ul>
                </section>
            </template>
        </template>
        <template v-if="dialog !== null">
            <TaskWaitDialog
                :change="dialog.change"
                :number="number"
                :prerequisite="dialog.prerequisite"
                :choices="actions?.choices ?? []"
                @close="dialog = null"
            />
        </template>
    </div>
</template>
