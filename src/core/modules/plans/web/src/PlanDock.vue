<script setup>
import { computed, unref } from "vue";
import {AgentBadge, READ_RATES, agentLabel, coalesced, eventAboutRows, eventChildOf, peekRef, SkeletonLine, useDockCard, useWindow} from "@journal/window-kit";

const PREVIEW_PHASES = 5;
const view = useWindow();
const card = useDockCard();
const item = view.option("row");
const foot = view.option("foot");
const progress = card.data;
const loading = computed(() => !card.data.value);
const phases = computed(() => card.data.value?.phases ?? []);
const planAgents = computed(() => card.data.value?.agents ?? []);
const agents = computed(() => [
  ...new Map(planAgents.value.map((agent) => [agent.id, agent])).values(),
]);
const hidden = computed(() =>
  Math.max(0, phases.value.length - PREVIEW_PHASES),
);
const idsOf = (rows) => new Set(rows.map((row) => row.id));
const concerns = {
  phase: (event) => eventAboutRows(event, idsOf(phases.value)) || eventChildOf(event, "plan_id", new Set([unref(item).target_id])),
  phase_task: (event) => eventChildOf(event, "phase_id", idsOf(phases.value)),
  task: (event) => eventAboutRows(event, idsOf(phases.value.flatMap((phase) => phase.tasks))),
  agent: (event) => eventAboutRows(event, idsOf(agents.value)),
};
const reload = coalesced(card.reload, READ_RATES.planCard);
view.follow(["phase.*", "phase_task.*", "task.*", "agent.*"], (event) => {
  const concernsThisPlan = concerns[event.event.split(".")[0]];
  if (!concernsThisPlan || concernsThisPlan(event)) reload();
});
</script>

<template>
  <template v-if="unref(foot)"
    ><Teleport :to="unref(foot)">
      <template v-if="loading"
        ><SkeletonLine :bars="[{ width: '80px', height: 10 }]"
      /></template>
      <template v-else-if="progress"
        ><span
          >Tasks:
          <b>{{
            progress.finished
              ? `${progress.finished} of ${progress.total}`
              : progress.total
          }}</b></span
        ></template
      >
    </Teleport></template
  >
  <template v-if="loading"
    ><SkeletonLine
      class="plan-dock-loading"
      :bars="[
        { width: '70%', height: 12 },
        { width: '45%', height: 12 },
      ]"
  /></template>
  <template v-if="agents.length">
    <div class="plan-dock-agents" data-plan-dock-agents>
      <span>Agents:</span>
      <template v-for="agent in agents" :key="agent.id">
        <button
          type="button"
          class="plan-dock-agent"
          :title="`Open ${agentLabel(agent.name, agent.main)}`"
          data-plan-dock-agent
          @click="peekRef(`agents:${agent.id}`)"
        >
          <AgentBadge :name="agent.name" :main="agent.main" />
        </button>
      </template>
    </div>
  </template>
  <ol class="plan-dock-phases">
    <template
      v-for="(phase, index) in phases.slice(0, PREVIEW_PHASES)"
      :key="phase.id"
    >
      <li
        :class="[
          'plan-dock-phase',
          { current: progress?.current_phase === index + 1 },
        ]"
      >
        <span class="plan-dock-number">{{ index + 1 }}</span>
        <span class="plan-dock-name">{{ phase.title }}</span>
        <span class="plan-dock-tasks">{{
          phase.tasks.length
            ? `${phase.tasks.length} task${phase.tasks.length === 1 ? "" : "s"}`
            : ""
        }}</span>
      </li>
    </template>
    <template v-if="hidden">
      <li class="plan-dock-phase quiet">
        <span />
        <span class="plan-dock-name"
          >and {{ hidden }} more phase{{ hidden === 1 ? "" : "s" }}</span
        >
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
  padding: 7px 14px 0 36px;
  align-items: center;
  color: var(--text-3);
  font-size: 12px;
}

.plan-dock-agent {
  padding: 0 8px;
  height: 20px;
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
  padding: 4px 14px 5px;
  list-style: none;
}

.plan-dock-phase {
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr) auto;
  align-items: center;

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
.plan-dock-agent:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.plan-dock-phase.current .plan-dock-name {
  color: var(--text);
}
.plan-dock-phase.current .plan-dock-tasks {
  color: var(--text-3);
}
.plan-dock-loading {
  margin: 8px 36px;
}
</style>
