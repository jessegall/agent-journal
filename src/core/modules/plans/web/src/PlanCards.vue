<script setup>
import {computed, ref, watch} from "vue";
import {Btn, Icon, Skeleton, peekRef, useRows} from "@journal/window-kit";

// plans as version 4 drew them: a card for each, the task count with a bar, the phase it is in, and tabs for the open and the closed
const {rows, failure, loaded, context} = useRows("plan list", ["plan.*", "phase.*", "task.*"]);
const CLOSED = new Set(["completed", "cancelled"]);
const tab = ref("open");
const progress = ref({});
const open = computed(() => rows.value.filter((row) => !CLOSED.has(row.state)));
const closed = computed(() => rows.value.filter((row) => CLOSED.has(row.state)));
const shown = computed(() => (tab.value === "open" ? open.value : closed.value));

watch(rows, async (list) => {
    if (context.shared) return;
    const read = await Promise.all(list.map((row) => context.read(`plan progress ${row.id}`)));
    progress.value = Object.fromEntries(list.map((row, at) => [row.id, read[at].ok ? read[at].value : null]));
}, {immediate: true});

const share = (row) => {
    const counts = progress.value[row.id];
    return counts && counts.task_count ? Math.round((counts.completed_count / counts.task_count) * 100) : 0;
};
</script>

<template>
    <div class="plans">
        <template v-if="!loaded">
            <Skeleton shape="cards" />
        </template>
        <template v-else-if="failure">
            <p class="plans-note">{{ failure }}</p>
        </template>
        <template v-else>
            <div class="plans-tabs">
                <Btn kind="text" :class="['plans-tab', {on: tab === 'open'}]" data-tab="open" @click="tab = 'open'">Open {{ open.length }}</Btn>
                <Btn kind="text" :class="['plans-tab', {on: tab === 'closed'}]" data-tab="closed" @click="tab = 'closed'">Closed {{ closed.length }}</Btn>
            </div>
            <template v-if="!shown.length">
                <p class="plans-note">{{ tab === "open" ? "No open plans" : "No closed plans" }}</p>
            </template>
            <div class="plans-grid">
                <template v-for="row in shown" :key="row.id">
                    <div class="plan" :data-row="row.id" role="button" tabindex="0" @click="peekRef(`plans:${row.id}`)" @keydown.enter="peekRef(`plans:${row.id}`)">
                        <span class="plan-head"><Icon name="plan" :size="12" /> Plan {{ row.id }}<span class="plan-state">{{ row.state }}</span></span>
                        <span class="plan-title">{{ row.title }}</span>
                        <span class="plan-bar"><span class="plan-bar-fill" :style="{width: `${share(row)}%`}" /></span>
                        <template v-if="progress[row.id]">
                            <span class="plan-foot">{{ progress[row.id].completed_count }} of {{ progress[row.id].task_count }} tasks done · phase {{ progress[row.id].current_phase }}</span>
                        </template>
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>

<style scoped>
.plans {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.plans-tabs {
    display: flex;
    gap: 14px;
}

.plans-tab {
    padding: 0 0 4px;
    border: 0;
    border-bottom: 1px solid transparent;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 11px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    cursor: pointer;
}

.plans-tab.on {
    border-bottom-color: var(--accent);
    color: var(--text);
}

.plans-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
}

.plan {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 14px 16px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--surface);
}

.plan-head {
    display: flex;
    gap: 6px;
    align-items: center;
    color: var(--text-3);
    font-size: 12px;
}

.plan-state {
    margin-left: auto;
}

.plan-title {
    font-weight: 500;
}

.plan-bar {
    height: 4px;
    border-radius: 2px;
    background: var(--raised);
}

.plan-bar-fill {
    display: block;
    height: 100%;
    border-radius: 2px;
    background: var(--accent);
}

.plan-foot,
.plans-note {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
