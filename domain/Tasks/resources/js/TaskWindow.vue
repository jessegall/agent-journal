<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import Button from '@kit/Button';
import FactsList from '@kit/FactsList';
import Reader from '@kit/Reader';
import SlotSections from '@kit/SlotSections';
import StateBadge from '@kit/StateBadge';
import Tabs from '@kit/Tabs';
import { list as tasksRoute } from '@generated/routes/tasks';
import type { TaskReaderData } from '@generated/types/tasks';
import TaskLogsTab from './TaskLogsTab.vue';
import TaskProofsTab from './TaskProofsTab.vue';
import { taskStateLook } from './taskLooks';

/**
 * One task, on its own page or in the inspector: Task 31 and its title first, the state below, then its facts each
 * labelled apart (the holder, the latest run and who runs it now, then what other domains add, such as Plans' plan of
 * the task), and its sections as
 * tabs: Brief, the brief's paragraphs in order as text, or No brief yet, never the result note instead; Logs and Proofs,
 * each read only once its tab is chosen.
 * Back returns to the tasks list it was opened from, with its query, or to the tasks list.
 */
const props = defineProps<{ data: TaskReaderData }>();

const section = ref('brief');
const opened = reactive(new Set(['brief']));
watch(section, (chosen) => opened.add(chosen));
const tabs = [
    { key: 'brief', label: 'Brief' },
    { key: 'logs', label: 'Logs' },
    { key: 'proofs', label: 'Proofs' },
];

const facts = computed(() => [
    {
        label: 'Holder',
        value: props.data.holder ? props.data.holder.name : 'Unassigned',
    },
    {
        label: 'Latest run',
        value:
            props.data.latestRun === undefined
                ? 'No run yet'
                : `Run ${props.data.latestRun}`,
    },
    {
        label: 'Running now',
        value: props.data.runningNow
            ? (props.data.runningNow.actorLabel ??
              `${props.data.runningNow.actorType} ${props.data.runningNow.actorId}`)
            : 'Nobody',
    },
]);
const paragraphs = computed(() =>
    props.data.brief
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter((paragraph) => paragraph !== ''),
);
const cameFromList = computed(
    () =>
        typeof document !== 'undefined' &&
        document.referrer !== '' &&
        new URL(document.referrer).pathname === tasksRoute.url(),
);

function back(): void {
    window.history.back();
}
</script>

<template>
    <div class="flex flex-col gap-3">
        <div class="px-4 pt-3">
            <template v-if="cameFromList">
                <Button size="small" @click="back">Back to tasks</Button>
            </template>
            <template v-else>
                <Button size="small" :href="tasksRoute.url()">Back to tasks</Button>
            </template>
        </div>
        <Reader :title="data.title">
            <template #meta>
                <span class="tabular-nums">Task {{ data.number }}</span>
            </template>
            <div class="mt-3 flex flex-col gap-3">
                <StateBadge v-bind="taskStateLook[data.state]" outlined />
                <FactsList :facts="facts" />
                <SlotSections :sections="data.sections" />
                <Tabs v-model="section" :tabs="tabs">
                    <template #brief>
                        <template v-if="paragraphs.length === 0">
                            <p class="text-body text-text-3">No brief yet</p>
                        </template>
                        <div class="flex flex-col gap-2">
                            <template
                                v-for="(paragraph, index) in paragraphs"
                                :key="index"
                            >
                                <p
                                    class="text-body whitespace-pre-wrap text-text-2 [overflow-wrap:anywhere]"
                                    v-text="paragraph"
                                />
                            </template>
                        </div>
                    </template>
                    <template #logs>
                        <template v-if="opened.has('logs')">
                            <TaskLogsTab :logs="data.logs" />
                        </template>
                    </template>
                    <template #proofs>
                        <template v-if="opened.has('proofs')">
                            <TaskProofsTab :proofs="data.proofs" />
                        </template>
                    </template>
                </Tabs>
            </div>
        </Reader>
    </div>
</template>
