<script setup>
import {computed, ref} from "vue";
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import PlanList from "./PlanList.vue";
import {parkPlan} from "../actions/plans.js";
import {useOutside} from "../composables/outside.js";
import {useLanding} from "../composables/planFlight.js";
import {usePlanRows} from "../composables/planRows.js";
import {peek} from "../route.js";
import {rows} from "../sync/rows.js";
import {doneOf, NOT_STARTED, othersLine, phaseOf, planButton, rowsOf} from "./statusline.js";

const PARKABLE = ["approved", "active", "waiting"];
const props = defineProps({p: Object, data: Object, others: Array, error: String});
const emit = defineEmits(["runBar", "failed"]);
const bar = ref(null);
const menu = ref(null);
const menuButton = ref(null);
const listButton = ref(null);
const opened = ref("");
useLanding(bar);
usePlanRows(() => [props.p]);
useOutside(menu, () => (opened.value = ""));

const count = computed(() => props.data.phases.length);
const toggle = (what) => (opened.value = opened.value === what ? "" : what);

function open() {
    opened.value = "";
    peek("plan", props.p.n);
}

async function park() {
    opened.value = "";
    try {
        await parkPlan(props.p);
    } catch (e) {
        emit("failed", e.message);
    }
}
</script>

<template>
    <div ref="bar" :class="['planbar', `planbar-${data.status}`]">
        <button type="button" class="planbar-link" :title="`Plan ${p.n}: ${p.title}`" @click="peek('plan', p.n)">
            <Icon name="plan" class="planbar-icon" />
            <span class="planbar-title">{{ p.title }}</span>
            <template v-if="phaseOf(p)">
                <span class="planbar-phase">
                    <b>Phase {{ data.current || 1 }} of {{ count }}</b>
                    · {{ phaseOf(p) }}
                </span>
            </template>
        </button>
        <template v-if="othersLine(others)">
            <button ref="listButton" type="button" :class="['planbar-others', {on: opened === 'list'}]" @click.stop="toggle('list')">
                {{ othersLine(others) }}
            </button>
            <template v-if="opened === 'list'">
                <PlanList :plans="others" :running="data.status !== 'approved'" :anchor="listButton" @close="opened = ''" />
            </template>
        </template>
        <template v-if="NOT_STARTED[data.status]">
            <span class="planbar-step">{{ NOT_STARTED[data.status] }}</span>
        </template>
        <template v-else>
            <span class="planbar-step" :title="`Phase ${data.current || 1} of ${count}`">
                {{ doneOf(p, rows("todo")) }}/{{ rowsOf(p).length }}
            </span>
            <span class="planbar-track" role="progressbar">
                <span :style="{width: `${(100 * doneOf(p, rows('todo'))) / Math.max(1, rowsOf(p).length)}%`}" />
            </span>
        </template>
        <template v-if="planButton(p)">
            <button type="button" :class="['planbar-act', {ack: data.status === 'done'}]" @click="$emit('runBar', p)">
                {{ planButton(p)[1] }}
                <Icon name="arrow" />
            </button>
        </template>
        <button
            ref="menuButton"
            type="button"
            :class="['planbar-menu', {on: opened === 'menu'}]"
            title="Plan actions"
            @click.stop="toggle('menu')"
        >
            <Icon name="dots" />
        </button>
        <template v-if="opened === 'menu'">
            <MenuPanel ref="menu" :anchor="menuButton" @click.stop @close="opened = ''">
                <MenuItem @click="open">Open plan</MenuItem>
                <template v-if="PARKABLE.includes(data.status)">
                    <MenuItem class="planbar-park" @click="park">
                        <span>Park</span>
                        <small>Stop it and set its open to-dos aside</small>
                    </MenuItem>
                </template>
            </MenuPanel>
        </template>
        <template v-if="error">
            <span class="planbar-error">{{ error }}</span>
        </template>
    </div>
</template>

<style scoped>
.planbar {
    --planbar-height: 32px;
    display: flex;
    align-items: center;
    gap: 10px;
    height: var(--planbar-height);
    padding: 0 8px 0 0;
    border-bottom: 1px solid var(--line);
    background: var(--bg-2);
    color: var(--text-2);
    font-size: 11.5px;
}

.planbar-link {
    border: 0;
    background: none;
    font: inherit;
    text-align: left;
    cursor: pointer;
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    height: 100%;
    padding: 0 14px 0 16px;
    color: inherit;
}

.planbar-link:hover {
    background: rgba(255, 255, 255, 0.03);
    color: var(--text);
}

.planbar-icon {
    flex: none;
    color: var(--text-3);
}

.planbar-title {
    flex: 0 1 auto;
    min-width: 0;
    max-width: 45%;
    overflow: hidden;
    color: var(--text);
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.planbar-phase {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    color: var(--text-3);
    text-overflow: ellipsis;
    white-space: nowrap;
}

.planbar-phase b {
    color: var(--text-2);
    font-weight: 400;
}

.planbar-others {
    flex: none;
    height: 22px;
    padding: 0 7px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 11.5px;
    white-space: nowrap;
    cursor: pointer;
    transition:
        background 0.15s,
        color 0.15s;
}

.planbar-others:hover,
.planbar-others.on {
    background: var(--hover);
    color: var(--text);
}

.planbar-step {
    flex: none;
    color: var(--text-3);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
}

.planbar-track {
    flex: none;
    width: 96px;
    height: 3px;
    border-radius: 3px;
    overflow: hidden;
    background: var(--line);
}

.planbar-track > span {
    display: block;
    height: 100%;
    border-radius: 3px;
    background: var(--text-2);
    transition: width 0.4s var(--ease);
}

.planbar-act {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 22px;
    padding: 0 10px;
    border: 1px solid color-mix(in srgb, var(--accent) 55%, transparent);
    border-radius: 6px;
    background: color-mix(in srgb, var(--accent) 22%, transparent);
    color: var(--text);
    font-size: 11px;
    cursor: pointer;
}

.planbar-act:hover {
    background: color-mix(in srgb, var(--accent) 34%, transparent);
}

.planbar-act .ico {
    width: 11px;
    height: 11px;
    color: inherit;
}

.planbar-act.ack {
    border-color: var(--border-2);
    background: var(--raised);
}

.planbar-menu {
    flex: none;
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    padding: 0;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    cursor: pointer;
    transition:
        background 0.15s,
        color 0.15s;
}

.planbar-menu:hover,
.planbar-menu.on {
    background: var(--hover);
    color: var(--text);
}

.planbar-park {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
}

.planbar-park small {
    color: var(--text-4);
    font-size: 11px;
}

.planbar-error {
    flex: none;
    color: var(--danger);
    font-size: 11px;
}

.planbar-enter-active,
.planbar-leave-active {
    overflow: hidden;
    transition:
        height 0.32s var(--ease),
        opacity 0.2s ease;
}

.planbar-enter-from,
.planbar-leave-to {
    height: 0;
    opacity: 0;
    border-bottom-width: 0;
}
</style>
