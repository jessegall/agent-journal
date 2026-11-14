<script setup>
import {computed} from "vue";
import {HoverTip, TaskBar, peekRef} from "@journal/window-kit";
import {shortJobTitle, taskLine} from "./agentTaskLine.js";

// the bottom line of an agent's row: "Plan" and its number for an agent working on a plan, else "Task" and its number with its title in a tooltip, or "Tasks" and the number of each task it has started when there are several, how many of its tasks are done at the far right
// with the rest in a tooltip; an agent whose tasks were all handed in keeps the count and bar at zero for its next batch; and the thin bar of its tasks done and in testing; a helper has a job, named by the title its sender gave it or else the first words of the job, whose question is its tooltip, followed by the program the job runs on and whether it began a new conversation or resumed one
const props = defineProps({tasks: {type: Array, default: () => []}, inHand: {type: Object, default: null}, job: {type: String, default: ""}, jobTitle: {type: String, default: ""}, jobLaunch: {type: String, default: ""}, perHour: {type: Number, default: 0}, countsEmpty: {type: Boolean, default: false}});
const MOST_LISTED = 3;
const line = computed(() => (props.inHand ? taskLine({tasks: props.tasks, inHand: props.inHand, perHour: props.perHour}) : null));
</script>

<template>
    <template v-if="job && !line">
      <span class="task-line" data-agent-task-line>
          <HoverTip as="button" class="task" data-agent-job>{{ shortJobTitle(jobTitle, job) }}<template #tip><b>{{ job }}</b></template></HoverTip>
          <template v-if="jobLaunch"><span class="plan" data-agent-job-launch>{{ jobLaunch }}</span></template>
      </span>
    </template>
    <template v-else-if="line">
        <span class="task-line" data-agent-task-line>
            <template v-if="line.plan">
                <HoverTip as="button" class="task" data-agent-plan :data-peek="`plans:${line.plan}`" :aria-label="`Plan ${line.plan}: ${line.planTitle}`" @click.stop="peekRef(`plans:${line.plan}`)">Plan {{ line.plan }}<template #tip><b>{{ line.planTitle }}</b><span>Task {{ line.number }}: {{ line.title }}</span></template></HoverTip>
            </template>
            <template v-else-if="line.started.length > MOST_LISTED">
                <span class="tasks" data-agent-tasks><HoverTip as="button" class="task" data-agent-task-count :aria-label="`Tasks: ${line.started.length}`">Tasks: {{ line.started.length }}<template #tip><template v-for="task in line.started" :key="task.number"><b class="listed" data-agent-task-listed>{{ task.number }} {{ task.title }}</b></template></template></HoverTip></span>
            </template>
            <template v-else-if="line.started.length > 1">
                <span class="tasks" data-agent-tasks>Tasks <template v-for="(task, place) in line.started" :key="task.number"><template v-if="place">, </template><HoverTip as="button" class="task" data-agent-task :data-peek="`tasks:${task.number}`" :aria-label="`Task ${task.number}: ${task.title}`" @click.stop="peekRef(`tasks:${task.number}`)">{{ task.number }}<template #tip><b>{{ task.title }}</b></template></HoverTip></template></span>
            </template>
            <template v-else>
                <HoverTip as="button" class="task" data-agent-task :data-peek="`tasks:${line.number}`" :aria-label="`Task ${line.number}: ${line.title}`" @click.stop="peekRef(`tasks:${line.number}`)">Task {{ line.number }}<template #tip><b>{{ line.title }}</b><span>{{ line.taskTip }}</span></template></HoverTip>
            </template>
            <template v-if="line.rate"><span class="rate" data-agent-rate>{{ line.rate }}</span></template>
            <HoverTip class="count" tabindex="0" place="right" data-agent-count>{{ line.count }}<template #tip><b>{{ line.countTip }}</b><template v-if="line.paceTip">
  <span>{{ line.paceTip }}</span>
</template></template></HoverTip>
        </span>
        <TaskBar class="bar" data-agent-bar aria-hidden="true" :total="line.bar.total" :done="line.bar.done" :testing="line.bar.testing" :started="line.bar.started" />
    </template>
    <template v-else-if="countsEmpty">
        <span class="task-line" data-agent-task-line><span class="task" data-agent-no-task>No task</span><span class="count" data-agent-count>0 of 0</span></span>
        <TaskBar class="bar" data-agent-bar aria-hidden="true" :total="0" :done="0" :testing="0" :started="0" />
    </template>
</template>

<style scoped>
.task-line { display: flex; gap: 12px; align-items: baseline; margin-top: 3px; }
.task { position: relative; flex: none; padding: 0; border: 0; background: none; color: var(--text-2); font: inherit; font-size: 12.5px; text-decoration: underline dotted var(--text-4); text-underline-offset: 3px; cursor: pointer; }
.task:hover { color: var(--text); }
.tasks { flex: none; color: var(--text-2); font-size: 12.5px; }
.plan { flex: none; margin-left: -6px; color: var(--text-4); font-size: 11px; }
.plan::before { content: "·"; margin-right: 6px; }
.count { position: relative; flex: none; margin-left: auto; color: var(--text-2); font-size: 13px; font-weight: 500; font-variant-numeric: tabular-nums; cursor: default; }
.rate { flex: none; margin-left: auto; color: var(--text-4); font-size: 11px; font-variant-numeric: tabular-nums; }
.rate + .count { margin-left: 0; }
.listed { display: block; }
.bar { margin-top: 5px; }
</style>
