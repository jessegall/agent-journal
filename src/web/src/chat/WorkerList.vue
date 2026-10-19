<script setup>
import {workerCounts, workerName, workersBySection} from "../domain/workers.js";
import {computed, ref} from "vue";
import CloseButton from "../kit/CloseButton.vue";
import Btn from "../kit/Btn.vue";
import FoldGroup from "../kit/FoldGroup.vue";
import WorkerRow from "./WorkerRow.vue";
import Skeleton from "../kit/Skeleton.vue";
import {peek} from "../route.js";

const props = defineProps({rows: {type: Array, default: () => []}, loading: Boolean});
const emit = defineEmits(["close"]);
const sections = computed(() => workersBySection(props.rows));
const counts = computed(() => workerCounts(props.rows));
const countsLine = computed(() =>
    [counts.value.working && `${counts.value.working} working`, counts.value.reported && `${counts.value.reported} with reports`]
        .filter(Boolean)
        .join(" · ")
);
const OPEN_SECTIONS = [
    {key: "working", title: "Working"},
    {key: "waiting", title: "Reported"},
];
const retiredOpen = ref(false);

function inspect(row) {
    peek("workers", row.id);
    emit("close");
}
</script>

<template>
    <div class="workers">
        <header class="workers-head">
            <div>
                <h4 class="workers-heading">Workers</h4>
                <span class="workers-counts">{{ countsLine }}</span>
            </div>
            <CloseButton @click="emit('close')" />
        </header>
        <div class="workers-body">
            <template v-if="!rows.length && loading">
                <Skeleton :count="3" label="Loading the workers" />
            </template>
            <template v-else-if="!rows.length">
                <p class="workers-none">No workers have been sent from here.</p>
            </template>
            <template v-for="section in OPEN_SECTIONS" :key="section.key">
                <template v-if="sections[section.key].length">
                    <h5 class="workers-section">{{ section.title }}</h5>
                    <template v-for="row in sections[section.key]" :key="row.id">
                        <WorkerRow :row="row" @inspect="inspect(row)" />
                    </template>
                </template>
            </template>
            <template v-if="sections.retired.length">
                <FoldGroup bar class="workers-closed" label="Closed" :count="sections.retired.length" :open="retiredOpen" @toggle="retiredOpen = !retiredOpen">
                    <template v-for="row in sections.retired" :key="row.id">
                        <Btn kind="text" class="workers-retired" v-tip="'Open this worker'" @click="inspect(row)">
                            {{ workerName(row) }}
                        </Btn>
                    </template>
                </FoldGroup>
            </template>
        </div>
    </div>
</template>

<style scoped>
.workers {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
}

.workers-head {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 2px 2px 8px 8px;
    border-bottom: 1px solid var(--line);
}

.workers-heading {
    margin: 0;
    color: var(--text);
    font-size: 13px;
    font-weight: 600;
}

.workers-counts {
    margin-left: 8px;
    color: var(--text-3);
    font-size: 12px;
}

.workers-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding-top: 4px;
}

.workers-closed {
    --fold-bleed: 6px;
}

.workers-section {
    margin: 10px 8px 2px;
    color: var(--text-3);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.workers-retired {
    display: block;
    padding: 4px 8px;
    color: var(--text-3);
    font-size: 12px;
}

.workers-none {
    margin: 8px;
    color: var(--text-3);
    font-size: 12px;
}
</style>
