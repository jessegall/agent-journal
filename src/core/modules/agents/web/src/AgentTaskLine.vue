<script setup>
import {computed} from "vue";
import {HoverTip, TaskBar, peekRef} from "@journal/window-kit";
import {taskLine} from "./agentTaskLine.js";

// the bottom line of an agent's row: "Task" and its number with its title in a tooltip, how many of its tasks are done at the far right
// with the rest in a tooltip, and the thin bar of its tasks done and in testing; a helper has a job, named by the title its sender gave it or else Job, whose question is its tooltip, followed by the program the job runs on and whether it began a new conversation or resumed one
const props = defineProps({tasks: {type: Array, default: () => []}, inHand: {type: Object, default: null}, job: {type: String, default: ""}, jobTitle: {type: String, default: ""}, jobLaunch: {type: String, default: ""}, perHour: {type: Number, default: 0}});
const line = computed(() => (props.inHand ? taskLine({tasks: props.tasks, inHand: props.inHand, perHour: props.perHour}) : null));
</script>

<template>
    <template v-if="job && !line">
      <span class="task-line" data-agent-task-line>
          <HoverTip as="button" class="task" data-agent-job>{{ jobTitle || "Job" }}<template #tip><b>{{ job }}</b></template></HoverTip>
          <template v-if="jobLaunch"><span class="plan" data-agent-job-launch>{{ jobLaunch }}</span></template>
      </span>
    </template>
    <template v-else-if="line">
        <span class="task-line" data-agent-task-line>
            <HoverTip as="button" class="task" data-agent-task :data-peek="`tasks:${line.number}`" :aria-label="`Task ${line.number}: ${line.title}`" @click.stop="peekRef(`tasks:${line.number}`)">Task {{ line.number }}<template #tip><b>{{ line.title }}</b><span>{{ line.taskTip }}</span></template></HoverTip>
            <template v-if="line.plan"><span class="plan" data-agent-plan>Plan {{ line.plan }}</span></template>
            <template v-if="line.rate"><span class="rate" data-agent-rate>{{ line.rate }}</span></template>
            <HoverTip class="count" tabindex="0" place="right" data-agent-count>{{ line.count }}<template #tip><b>{{ line.countTip }}</b><template v-if="line.paceTip">
  <span>{{ line.paceTip }}</span>
</template></template></HoverTip>
        </span>
        <TaskBar class="bar" data-agent-bar aria-hidden="true" :total="line.bar.total" :done="line.bar.done" :testing="line.bar.testing" />
    </template>
</template>

<style scoped>
.task-line { display: flex; gap: 12px; align-items: baseline; margin-top: 3px; }
.task { position: relative; flex: none; padding: 0; border: 0; background: none; color: var(--text-2); font: inherit; font-size: 12.5px; text-decoration: underline dotted var(--text-4); text-underline-offset: 3px; cursor: pointer; }
.task:hover { color: var(--text); }
.plan { flex: none; margin-left: -6px; color: var(--text-4); font-size: 11px; }
.plan::before { content: "·"; margin-right: 6px; }
.count { position: relative; flex: none; margin-left: auto; color: var(--text-3); font-size: 12px; font-variant-numeric: tabular-nums; cursor: default; }
.rate { flex: none; margin-left: auto; color: var(--text-4); font-size: 11px; font-variant-numeric: tabular-nums; }
.rate + .count { margin-left: 0; }
.bar { margin-top: 5px; }
</style>
