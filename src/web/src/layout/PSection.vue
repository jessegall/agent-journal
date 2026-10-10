<script setup>
import {awaitingMergeOf, delegationOf, doneOf, NOT_STARTED, phaseOf, planButton, rowsOf, standingOf} from "../domain/plans.js";
import {computed, ref} from "vue";
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import {parkPlan} from "../actions/plans.js";
import {useOutside} from "../composables/outside.js";
import {useLanding} from "../composables/planFlight.js";
import {usePlanRows} from "../composables/planRows.js";
import {peek} from "../route.js";
import {rows} from "../sync/rows.js";

const PARKABLE = ["approved", "active", "waiting"];
const props = defineProps({p: Object, data: Object, error: String});
const emit = defineEmits(["runBar", "failed"]);
const bar = ref(null);
const menu = ref(null);
const menuButton = ref(null);
const withButton = ref(null);
const withCard = ref(null);
const hovering = ref(false);
const opened = ref("");
useLanding(bar);
usePlanRows(() => [props.p]);
useOutside(menu, () => (opened.value = ""));
useOutside(withCard, () => (opened.value = ""));

const delegation = computed(() =>
    delegationOf(props.p, {todos: rows("todo"), helpers: rows("helper"), worktrees: rows("worktree"), tickets: rows("ticket")})
);
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
    <div ref="bar" :class="['planbar', `planbar-${data.status}`, {'planbar-delegated': delegation}]">
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
        <template v-if="delegation">
            <button
                ref="withButton"
                type="button"
                :class="['planbar-with', {on: opened === 'with'}]"
                @mouseenter="hovering = true"
                @mouseleave="hovering = false"
                @click.stop="toggle('with')"
            >
                {{ delegation.line }}
            </button>
            <template v-if="hovering || opened === 'with'">
                <MenuPanel ref="withCard" :anchor="withButton" @click.stop @close="opened = ''">
                    <div class="planbar-card">
                        <p class="planbar-card-head">Helpers working on this phase</p>
                        <template v-for="h in delegation.helpers" :key="h.n">
                            <div class="planbar-card-row">
                                <b>{{ h.name }}</b>
                                <span>{{ h.job }}</span>
                                <template v-if="h.branch">
                                    <small><Icon name="branch" :size="11" /> {{ h.branch }}</small>
                                </template>
                            </div>
                        </template>
                        <template v-for="n in delegation.tickets" :key="`ticket-${n}`">
                            <div class="planbar-card-row">
                                <b>The agent on ticket {{ n }}</b>
                            </div>
                        </template>
                        <template v-if="!delegation.helpers.length && !delegation.tickets.length">
                            <p class="planbar-card-none">No helper has been handed this phase yet. Delegated plans keep running beside the one the agent works.</p>
                        </template>
                    </div>
                </MenuPanel>
            </template>
        </template>
        <template v-if="NOT_STARTED[data.status]">
            <span class="planbar-step">{{ NOT_STARTED[data.status] }}</span>
        </template>
        <template v-else>
            <span class="planbar-step" :title="standingOf(p, rows('todo'))">
                {{ doneOf(p, rows("todo")) }}<template v-if="awaitingMergeOf(p, rows('todo'))">+{{ awaitingMergeOf(p, rows("todo")) }}</template>/{{ rowsOf(p).length }}
            </span>
            <span class="planbar-track" role="progressbar">
                <span :style="{width: `${(100 * doneOf(p, rows('todo'))) / Math.max(1, rowsOf(p).length)}%`}" />
                <span class="planbar-waiting" :style="{width: `${(100 * awaitingMergeOf(p, rows('todo'))) / Math.max(1, rowsOf(p).length)}%`}" />
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
                        <span>Pause</span>
                        <small>Pause the plan and its open to-dos</small>
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

.planbar-delegated .planbar-icon {
    color: var(--tone-helper);
}

.planbar-delegated .planbar-track > span {
    background: var(--tone-helper);
}

.planbar-delegated .planbar-step {
    color: var(--tone-helper);
}

.planbar-with {
    flex: none;
    height: 20px;
    padding: 0 8px;
    border: 1px solid var(--tone-helper);
    border-radius: 99px;
    background: none;
    color: var(--tone-helper);
    font: inherit;
    font-size: 11px;
    white-space: nowrap;
    cursor: pointer;
}

.planbar-with:hover,
.planbar-with.on {
    background: color-mix(in srgb, var(--tone-helper) 14%, transparent);
}

.planbar-card {
    width: 320px;
    max-width: calc(100vw - 36px);
}

.planbar-card-head {
    margin: 0;
    padding: 5px 8px 6px;
    color: var(--text-3);
    font-size: 11px;
}

.planbar-card-row {
    display: grid;
    gap: 2px;
    padding: 7px 8px;
    border-radius: 7px;
    font-size: 12px;
}

.planbar-card-row b {
    color: var(--text);
    font-weight: 500;
}

.planbar-card-row span {
    color: var(--text-2);
}

.planbar-card-row small {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--tone-helper);
    font-size: 11px;
}

.planbar-card-none {
    margin: 0;
    padding: 4px 8px 8px;
    color: var(--text-4);
    font-size: 11.5px;
}

.planbar-step {
    flex: none;
    color: var(--text-3);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
}

.planbar-track {
    display: flex;
    flex: none;
    width: 96px;
    height: 3px;
    border-radius: 3px;
    overflow: hidden;
    background: var(--line);
}

.planbar-track > span {
    display: block;
    flex: none;
    height: 100%;
    background: var(--text-2);
    transition: width 0.4s var(--ease);
}

.planbar-track > .planbar-waiting {
    background: var(--text-2);
    opacity: 0.4;
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
