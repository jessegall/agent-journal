<script setup>
import {computed, ref, watch} from "vue";
import {peekRef, useWindow} from "@journal/window-kit";

const PREVIEW_PHASES = 5;
const context = useWindow();
const item = context.option("row");
const phases = ref([]);
const planAgents = ref([]);
const agents = computed(() => [...new Map(planAgents.value.map((agent) => [agent.id, agent])).values()]);
const hidden = computed(() => Math.max(0, phases.value.length - PREVIEW_PHASES));
async function load() {
    const planId = item.value?.target_id;
    if (!planId) return;
    const answer = await context.read(`plan outline ${planId}`);
    phases.value = answer.ok ? answer.value.phases : [];
    planAgents.value = answer.ok ? answer.value.agents : [];
}

context.follow(["phase.*", "phase_task.*", "task.*", "agent.*"], load);
watch(() => item.value?.target_id, load, {immediate: true});
</script>

<template>
    <template v-if="agents.length">
        <div class="plan-dock-agents" data-plan-dock-agents>
            <template v-for="agent in agents" :key="agent.id">
                <button type="button" class="plan-dock-agent" :title="`Open ${agent.name}`" data-plan-dock-agent @click="peekRef(`agents:${agent.id}`)">{{ agent.name }}</button>
            </template>
        </div>
    </template>
    <ol class="plan-dock-phases">
        <template v-for="(phase, index) in phases.slice(0, PREVIEW_PHASES)" :key="phase.id">
            <li class="plan-dock-phase">
                <span class="plan-dock-number">{{ index + 1 }}</span>
                <span class="plan-dock-name">{{ phase.title }}</span>
                <span class="plan-dock-tasks">{{ phase.tasks.length ? `${phase.tasks.length} task${phase.tasks.length === 1 ? "" : "s"}` : "" }}</span>
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
.plan-dock-agents {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 0 12px 6px 16px;
}

.plan-dock-agent {
    padding: 0 8px;
    border: 1px solid var(--border-2);
    border-radius: 99px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 11.5px;
    line-height: 20px;
    cursor: pointer;
}

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
