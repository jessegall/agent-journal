<script setup>
import {computed, ref} from "vue";
import {AgentBadge, HoverTip, Icon, PRIORITY_LEVELS, PriorityIcon, agentLabel, namedPriority, peekRef, priorityLabel, scoreMeaning} from "@journal/window-kit";

// the three fixed columns at the right of a task row: the agent on the task, its complexity and its priority; a task with no agent or no
// complexity leaves that column empty, so the columns line up from row to row
const HELD_STATES = new Set(["started", "testing", "blocked"]);
const MOST_COMPLEX = 5;
const HARD_FROM = 4;
const props = defineProps({row: {type: Object, required: true}});
const emit = defineEmits(["priority"]);
const held = computed(() => HELD_STATES.has(props.row.state));
const named = computed(() => namedPriority(props.row.priority));
const tipLabel = computed(() => agentLabel(`Worker ${props.row.delegated_to}`, props.row.main_delegate));
const open = ref(false);
const levels = PRIORITY_LEVELS.toReversed();

function pick(key) {
    open.value = false;
    emit("priority", key);
}
</script>

<template>
    <span class="icons" data-task-icons @click.stop @keydown.enter.stop>
        <template v-if="row.delegated_to">
            <HoverTip as="button" :class="['cell', 'agent', {queued: !held}]" place="right" data-task-agent :data-held="held ? '' : null" :aria-label="tipLabel" @click="peekRef(`agents:${row.delegated_to}`)">
                <span class="mark"><AgentBadge :name="tipLabel" :main="row.main_delegate" icon-only /></span>
                <template #tip><b>{{ tipLabel }}</b></template>
            </HoverTip>
        </template>
        <template v-else>
          <span class="cell empty" />
        </template>
        <template v-if="row.complexity">
            <HoverTip class="cell" place="right" tabindex="0" role="img" data-task-complexity :aria-label="`Complexity ${row.complexity} of ${MOST_COMPLEX}: ${scoreMeaning(row.complexity)}`">
                <svg :class="['cx', {hard: row.complexity >= HARD_FROM}]" width="15" height="15" viewBox="0 0 16 16" aria-hidden="true"><template v-for="place in MOST_COMPLEX" :key="place">
  <rect :x="1.6 + (place - 1) * 2.7" :y="13 - (1 + place * 2)" width="1.8" :height="1 + place * 2" rx="0.6" :class="{on: place <= row.complexity}" />
</template></svg>
                <template #tip><b>Complexity {{ row.complexity }} of {{ MOST_COMPLEX }}</b><span>{{ scoreMeaning(row.complexity) }}</span></template>
            </HoverTip>
        </template>
        <template v-else>
          <span class="cell empty" />
        </template>
        <span :class="['cell', 'prio-cell', {shown: open}]" tabindex="0" role="button" aria-haspopup="menu" :aria-label="`Priority: ${priorityLabel(named)}. Change it`" data-task-priority @click="open = !open" @keydown.space.prevent="open = !open" @keydown.esc="open = false">
            <PriorityIcon :value="row.priority" />
            <span class="menu" role="menu" data-priority-menu>
                <span class="menu-head">Priority: {{ priorityLabel(named) }}</span>
                <template v-for="level in levels" :key="level.key">
                  <button type="button" :class="['menu-item', {on: level.key === named}]" role="menuitemradio" :aria-checked="level.key === named" :data-priority-option="level.key" @click.stop="pick(level.key)">
                      <PriorityIcon :value="level.key" />{{ level.label }}<template v-if="level.key === named">
    <Icon name="check" :size="12" class="check" />
  </template>
                  </button>
                </template>
            </span>
        </span>
    </span>
</template>

<style scoped>
.icons { flex: none; display: grid; grid-template-columns: 22px 22px 22px; gap: 2px; align-items: center; }
.cell { position: relative; display: grid; place-items: center; width: 22px; height: 22px; padding: 0; border: 0; border-radius: 6px; background: none; color: var(--text-3); font: inherit; cursor: pointer; }
.cell:hover { background: var(--sel); }
.cell:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
.cell.empty { pointer-events: none; }
.mark { display: grid; place-items: center; width: 18px; height: 18px; color: var(--progress, var(--accent)); }
.agent.queued .mark { color: var(--text-3); }
.cx rect { fill: var(--border-3); }
.cx rect.on { fill: var(--text-3); }
.cx.hard rect.on { fill: var(--blocking); }
.menu { position: absolute; z-index: 7; top: 24px; right: -4px; display: none; width: 178px; padding: 4px; border: 1px solid var(--border-3); border-radius: 9px; background: var(--sel); box-shadow: 0 8px 22px rgba(0, 0, 0, .35); cursor: default; }
.menu::before { content: ""; position: absolute; top: -8px; right: 0; left: 0; height: 8px; }
.prio-cell:hover > .menu, .prio-cell:focus-within > .menu, .prio-cell.shown > .menu { display: block; }
.menu-head { display: block; padding: 4px 8px 3px; color: var(--text-3); font-size: 11px; font-weight: 600; }
.menu-item { display: flex; gap: 8px; align-items: center; width: 100%; padding: 5px 8px; border: 0; border-radius: 6px; background: none; color: var(--text); font: inherit; font-size: 12.5px; text-align: left; cursor: pointer; }
.menu-item:hover { background: var(--hover); }
.menu-item .check { margin-left: auto; color: var(--accent-text); }
.menu-item.on { font-weight: 500; }
</style>
