<script setup>
import {computed} from "vue";
import TimeAgo from "../../../kit/TimeAgo.vue";
import {peek} from "../../route.js";
import ProcessQueueBand from "../ProcessQueueBand.vue";

// what the agent does at this moment: the task it holds, the command it runs, when it last did anything, and how far the plan of that task is
const props = defineProps({inspection: {type: Object, required: true}, tool: {type: Object, default: () => ({})}, nothing: {type: String, required: true}});
const doing = computed(() => {
    if (props.tool.tool) return `Command: ${props.tool.tool}`;
    if (props.tool.thinking) return "Thinking";
    return props.tool.wait_target ? `Waiting: ${props.tool.wait_target}` : "";
});
const share = computed(() => (props.inspection.plan?.total ? Math.round((props.inspection.plan.done / props.inspection.plan.total) * 100) : 0));
</script>

<template>
    <ProcessQueueBand icon="play">Doing now</ProcessQueueBand>
    <div class="now" data-agent-now>
        <template v-if="inspection.task">
            <button type="button" class="link" data-agent-task-link @click="peek('tasks', inspection.task.id)">Task {{ inspection.task.id }}: {{ inspection.task.title }}</button>
        </template>
        <template v-else>
            <span class="muted">{{ nothing }}</span>
        </template>
        <template v-if="doing">
            <span class="detail" data-agent-doing>{{ doing }}</span>
        </template>
        <template v-if="inspection.last_activity">
            <span class="detail" data-agent-last-activity>Seen: <TimeAgo :at="inspection.last_activity" /></span>
        </template>
    </div>
    <template v-if="inspection.plan">
        <div class="plan" data-agent-plan>
            <div class="line">
                <span>Plan {{ inspection.plan.id }}, phase {{ inspection.plan.phase }}</span>
                <button type="button" class="link" data-agent-plan-link @click="peek('plans', inspection.plan.id)">Show the plan</button>
            </div>
            <span class="detail">{{ inspection.plan.done }} of {{ inspection.plan.total }} tasks done</span>
            <div class="bar"><i :style="{width: `${share}%`}" /></div>
        </div>
    </template>
</template>

<style scoped>
.now { display: flex; flex-direction: column; align-items: flex-start; gap: 5px; padding: 9px 14px; border-bottom: 1px solid var(--border-inner); }
.detail { max-width: 100%; overflow: hidden; color: var(--text-3); font-size: 11.5px; text-overflow: ellipsis; white-space: nowrap; }
.muted { color: var(--text-3); font-size: 12.5px; }
.link { padding: 0; border: 0; background: none; color: var(--accent-text); font: inherit; font-size: 12.5px; text-align: left; cursor: pointer; }
.link:hover { text-decoration: underline; }
.plan { display: flex; flex-direction: column; gap: 3px; padding: 9px 14px; border-bottom: 1px solid var(--border-inner); }
.line { display: flex; justify-content: space-between; gap: 10px; color: var(--text-2); font-size: 12px; }
.bar { height: 4px; margin-top: 4px; border-radius: 2px; background: var(--chip); }
.bar i { display: block; height: 100%; border-radius: 2px; background: var(--accent); }
</style>
