<script setup>
import {computed, ref, watch} from "vue";
import {useWindow} from "@journal/window-kit";

// the body of a docked plan, as version 4's plan card drew it: the plan's phases, each with the number of its tasks
const PREVIEW_PHASES = 5;
const context = useWindow();
const item = context.option("row");
const phases = ref([]);
const hidden = computed(() => Math.max(0, phases.value.length - PREVIEW_PHASES));
const rowsOf = (answer) => (answer.ok ? answer.value.rows : []);

async function load() {
    const planId = item.value?.target_id;
    if (!planId) return;
    const found = rowsOf(await context.read(`phase list --plan ${planId} --oldest --limit 100`));
    const shown = await Promise.all(found.slice(0, PREVIEW_PHASES).map(async (phase) => ({
        ...phase,
        tasks: rowsOf(await context.read(`phase-task list --phase ${phase.id} --limit 100`)).length,
    })));
    phases.value = [...shown, ...found.slice(PREVIEW_PHASES)];
}

context.follow(["phase.*", "phase_task.*"], load);
watch(() => item.value?.target_id, load, {immediate: true});
</script>

<template>
    <ol class="plan-dock-phases">
        <template v-for="(phase, index) in phases.slice(0, PREVIEW_PHASES)" :key="phase.id">
            <li class="plan-dock-phase">
                <span class="plan-dock-number">{{ index + 1 }}</span>
                <span class="plan-dock-name">{{ phase.title }}</span>
                <span class="plan-dock-tasks">{{ phase.tasks ? `${phase.tasks} task${phase.tasks === 1 ? "" : "s"}` : "" }}</span>
            </li>
        </template>
        <template v-if="hidden">
            <li class="plan-dock-phase quiet">
                <span />
                <span class="plan-dock-name">and {{ hidden }} more phase{{ hidden === 1 ? "" : "s" }}</span>
                <span />
            </li>
        </template>
    </ol>
</template>

<style scoped>
.plan-dock-phases {
    margin: 0;
    padding: 0 12px 9px 16px;
    list-style: none;
}

.plan-dock-phase {
    display: grid;
    grid-template-columns: 18px minmax(0, 1fr) auto;
    align-items: center;
    column-gap: 8px;
    height: 24px;
    font-size: 12.5px;
}

.plan-dock-number {
    color: var(--text-4);
    font-family: var(--mono);
    font-size: 11px;
}

.plan-dock-name {
    overflow: hidden;
    color: var(--text-2);
    text-overflow: ellipsis;
    white-space: nowrap;
}

.plan-dock-phase.quiet .plan-dock-name {
    color: var(--text-4);
}

.plan-dock-tasks {
    color: var(--text-4);
    font-size: 11.5px;
}
</style>
