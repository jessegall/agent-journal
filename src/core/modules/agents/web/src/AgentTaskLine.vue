<script setup>
import {computed} from "vue";
import {HoverTip, peekRef} from "@journal/window-kit";
import {taskLine} from "./agentTaskLine.js";

// the bottom line of an agent's row: "Task" and its number with its title in a tooltip, how many of its tasks are done at the far right
// with the rest in a tooltip, and a thin bar of one segment for each task; a helper has a job, whose question is its tooltip
const props = defineProps({tasks: {type: Array, default: () => []}, inHand: {type: Object, default: null}, job: {type: String, default: ""}, state: {type: String, required: true}, perHour: {type: Number, default: 0}});
const line = computed(() => (props.inHand ? taskLine({tasks: props.tasks, inHand: props.inHand, perHour: props.perHour}) : null));
</script>

<template>
    <template v-if="job && !line">
      <span class="task-line" data-agent-task-line>
          <HoverTip as="button" class="task" data-agent-job>Job<template #tip><b>{{ job }}</b></template></HoverTip>
      </span>
    </template>
    <template v-else-if="line">
        <span class="task-line" data-agent-task-line>
            <HoverTip as="button" class="task" data-agent-task :data-peek="`tasks:${line.number}`" :aria-label="`Task ${line.number}: ${line.title}`" @click.stop="peekRef(`tasks:${line.number}`)">Task {{ line.number }}<template #tip><b>{{ line.title }}</b><span>{{ line.taskTip }}</span></template></HoverTip>
            <HoverTip class="count" tabindex="0" place="right" data-agent-count>{{ line.count }}<template #tip><b>{{ line.countTip }}</b><template v-if="line.paceTip">
  <span>{{ line.paceTip }}</span>
</template></template></HoverTip>
        </span>
        <span :class="['bar', {continuous: line.bar.continuous}]" :data-state="state" :style="line.bar.continuous ? {'--done': `${line.bar.done}%`, '--now': `${line.bar.now}%`} : undefined" data-agent-bar aria-hidden="true">
            <template v-for="(segment, place) in line.bar.segments" :key="place">
              <i :class="segment.kind" />
            </template>
        </span>
    </template>
</template>

<style scoped>
.task-line { display: flex; gap: 12px; align-items: baseline; margin-top: 3px; }
.task { position: relative; flex: none; padding: 0; border: 0; background: none; color: var(--text-2); font: inherit; font-size: 12.5px; text-decoration: underline dotted var(--text-4); text-underline-offset: 3px; cursor: pointer; }
.task:hover { color: var(--text); }
.count { position: relative; flex: none; margin-left: auto; color: var(--text-3); font-size: 12px; font-variant-numeric: tabular-nums; cursor: default; }
.bar { --c: var(--accent); display: flex; gap: 2px; height: 3px; margin-top: 5px; }
.bar[data-state="waiting"] { --c: var(--paused); }
.bar[data-state="blocked"] { --c: var(--blocking); }
.bar i { flex: 1; border-radius: 2px; background: var(--border-2); overflow: hidden; }
.bar i.done { background: var(--text-3); }
.bar i.now { background: var(--c); }
.bar.continuous { gap: 0; border-radius: 2px; background: linear-gradient(90deg, var(--text-3) var(--done), var(--c) var(--done) calc(var(--done) + var(--now)), var(--border-2) calc(var(--done) + var(--now))); }
</style>
