<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import Menu from '@kit/Menu';
import MenuItem from '@kit/MenuItem';
import MenuItemLabel from '@kit/MenuItemLabel';
import Button from '@kit/Button';
import { keyedPost } from '@kit/keyedPost';
import CommentsPanel from '@kit/CommentsPanel';
import { commentThreadOf } from '@kit/commentThreads';
import { useHostProp } from '@kit/hostProp';
import FactItem from '@kit/FactItem';
import FactList from '@kit/FactList';
import Reader from '@kit/Reader';
import SlotSections from '@kit/SlotSections';
import StateBadge from '@kit/StateBadge';
import Tabs from '@kit/Tabs';
import { list as tasksRoute, start as startRoute } from '@generated/routes/tasks';
import type { TaskReaderData } from '@generated/types/tasks';
import TaskActionDialog from './TaskActionDialog.vue';
import TaskLogsTab from './TaskLogsTab.vue';
import TaskProofsTab from './TaskProofsTab.vue';
import TaskWaitsTab from './TaskWaitsTab.vue';
import { taskStateLook } from './taskLooks';

/**
 * One task, on its own page or in the inspector: Task 31 and its title first, the state below, then its facts each
 * labelled apart (the holder, the latest run and who runs it now, then what other domains add, such as Plans' plan of
 * the task), and its sections as
 * tabs: Brief, Waits (opened first when the reader was asked for them), the brief's paragraphs in order as text, or No brief yet, never the result note instead; Logs and Proofs,
 * each read only once its tab is chosen; and Comments, Core's thread on the task, whose draft and lost post this
 * pane keeps for the task across tabs and redraws.
 * Back returns to the tasks list it was opened from, with its query, or to the tasks list.
 */
const props = defineProps<{ data: TaskReaderData }>();

const pane = useHostProp();
const dialog = ref<'block' | 'cancel' | null>(null);
const notice = ref('');
const startStatus = ref<'idle' | 'sending' | 'unknown'>('idle');
const startKey = ref(crypto.randomUUID());

function start(): void {
    startStatus.value = 'sending';
    notice.value = '';
    keyedPost(
        startRoute.url({ task: props.data.number }),
        {},
        startKey.value,
        {
            onAccepted: () => {
                startStatus.value = 'idle';
                startKey.value = crypto.randomUUID();
            },
            onRefused: (message) => {
                startStatus.value = 'idle';
                notice.value = message ?? 'This was refused.';
            },
            onUncertain: () => {
                startStatus.value = 'unknown';
            },
        },
        [pane],
    );
}
const thread = computed(() => commentThreadOf(pane, props.data.label));
const section = ref(props.data.waits === undefined ? 'brief' : 'waits');
const opened = reactive(new Set([section.value]));
watch(section, (chosen) => opened.add(chosen));
const tabs = [
    { key: 'brief', label: 'Brief' },
    { key: 'waits', label: 'Waits' },
    { key: 'logs', label: 'Logs' },
    { key: 'proofs', label: 'Proofs' },
    { key: 'comments', label: 'Comments' },
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
                <div class="flex flex-wrap items-center gap-2">
                    <StateBadge v-bind="taskStateLook[data.state]" outlined />
                    <template v-if="data.actions.mayStart">
                        <Button
                            variant="primary"
                            size="small"
                            :pending="startStatus === 'sending'"
                            @click="start"
                            >Start task</Button
                        >
                    </template>
                    <template v-else-if="data.actions.startReason">
                        <span class="text-small text-text-3">{{ data.actions.startReason }}</span>
                    </template>
                    <template v-if="data.actions.mayBlock || data.actions.mayCancel">
                        <Menu :label="`Actions for task ${data.number}`">
                            <template v-if="data.actions.mayBlock">
                                <MenuItem @click="dialog = 'block'"><MenuItemLabel>Block task</MenuItemLabel></MenuItem>
                            </template>
                            <template v-if="data.actions.mayCancel">
                                <MenuItem @click="dialog = 'cancel'"><MenuItemLabel>Cancel task</MenuItemLabel></MenuItem>
                            </template>
                        </Menu>
                    </template>
                </div>
                <template v-if="startStatus === 'unknown'">
                    <p role="status" class="flex items-center gap-2 text-small text-text-2">
                        <span>Outcome unknown: the task may or may not have started.</span>
                        <Button size="small" variant="bordered" @click="start">Check task</Button>
                    </p>
                </template>
                <template v-if="notice !== ''">
                    <p role="alert" class="text-small text-text-2">{{ notice }}</p>
                </template>
                <template v-if="data.state === 'cancelled' && data.cancelReason !== undefined">
                    <p class="text-small text-text-2">
                        Cancelled:
                        <span class="whitespace-pre-wrap" v-text="data.cancelReason" />
                    </p>
                </template>
                <template v-if="data.state === 'finished' && data.resultNote !== undefined">
                    <p class="text-small text-text-2">
                        Finished in run {{ data.latestRun }}:
                        <span class="whitespace-pre-wrap" v-text="data.resultNote" />
                    </p>
                </template>
                <template v-if="dialog !== null">
                    <TaskActionDialog
                        :change="dialog"
                        :number="data.number"
                        :revision="data.revision"
                        :run-number="data.actions.runNumber"
                        @close="dialog = null"
                        @refused="(message) => { notice = message; dialog = null; }"
                    />
                </template>
                <template v-if="data.blockReason !== undefined">
                    <p
                        class="rounded-control border border-border-2 px-3 py-2 text-body text-text"
                    >
                        <span class="font-medium">Blocked</span>
                        <template v-if="data.latestRun !== undefined">
                            in run {{ data.latestRun }}</template
                        >:
                        <span
                            class="whitespace-pre-wrap [overflow-wrap:anywhere]"
                            v-text="data.blockReason"
                        />
                    </p>
                </template>
                <FactList>
                    <FactItem
                        v-for="fact in facts"
                        :key="fact.label"
                        :term="fact.label"
                    >
                        {{ fact.value }}
                    </FactItem>
                </FactList>
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
                    <template #waits>
                        <template v-if="opened.has('waits')">
                            <TaskWaitsTab
                                :waits="data.waits"
                                :actions="data.waitActions"
                                :number="data.number"
                            />
                        </template>
                    </template>
                    <template #logs>
                        <template v-if="opened.has('logs')">
                            <TaskLogsTab :logs="data.logs" />
                        </template>
                    </template>
                    <template #comments>
                        <CommentsPanel
                            :comments="data.comments"
                            :target="data.label"
                            :version="String(data.revision)"
                            :thread="thread"
                        />
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
