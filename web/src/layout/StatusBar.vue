<script setup>
import {computed, ref, watch} from "vue";
import {act, saveSettings} from "../api.js";
import {gist} from "../gist.js";
import Icon from "../kit/Icon.vue";
import Switch from "../kit/Switch.vue";
import {go, route} from "../route.js";
import {agent, autoOn, reload, rows} from "../store.js";

const state = computed(() => (agent.value && agent.value.data.status !== "stopped" ? agent.value.data.status : "stopped"));
const line = computed(() => {
    if (state.value === "stopped") return "no agent is on this environment";
    const work = rows("work").find((w) => !w.completed);
    return work ? `on ${work.title}` : state.value === "idle" ? "waiting for you" : "working";
});
const was = ref("");
const sentence = computed(() => {
    const now = line.value;
    let i = 0;
    while (i < now.length && i < was.value.length && now[i] === was.value[i]) i += 1;
    const cut = i >= 6 && i < now.length ? now.lastIndexOf(" ", i) + 1 : 0;
    return {head: now.slice(0, cut), tail: now.slice(cut)};
});
watch(line, (now, before) => (was.value = before || ""));
const command = computed(() => (agent.value && state.value === "working" ? gist(agent.value.data.command) : ""));
const plans = computed(() => rows("plan").filter((p) => ["ready", "active", "waiting", "done"].includes(p.data.status) && !p.completed));
const error = ref("");

const phaseOf = (p) => {
    const i = p.data.current || 1;
    return p.data.phases[i - 1] ? `phase ${i}, ${p.data.phases[i - 1].title}` : "";
};

const doneOf = (p) =>
    p.data.phases.filter((ph) => ph.todos.length && ph.todos.every((n) => (rows("todo").find((t) => t.n === n) || {}).completed)).length;

const button = (p) =>
    ({ready: ["activate", "Start"], waiting: ["continue", "Continue"], done: ["acknowledge", "Acknowledge"]})[p.data.status] || null;

async function setAuto(on) {
    await saveSettings(route.value.env, {features: {auto: on}});
    await reload();
}

async function runBar(p) {
    error.value = "";
    try {
        await act(route.value.env, "plan", p.n, button(p)[0]);
        await reload();
    } catch (e) {
        error.value = e.message;
    }
}
</script>

<template>
    <div class="statusbar" @click.self="go(route.env)">
        <span :class="['statusbar-dot', {live: state !== 'stopped'}]" />
        <button type="button" class="statusbar-text" @click="go(route.env)">
            <b>{{ state[0].toUpperCase() + state.slice(1) }}</b>
            <span class="statusbar-roll">
                <template v-if="sentence.head">
                    <span class="statusbar-head">{{ sentence.head }}</span>
                </template>
                <Transition name="roll">
                    <span :key="sentence.tail" class="statusbar-line">{{ sentence.tail }}</span>
                </Transition>
            </span>
        </button>
        <span class="statusbar-running">
            <Transition name="roll">
                <span v-if="command" :key="command" class="statusbar-run-line" :title="agent.data.command">{{ command }}</span>
            </Transition>
        </span>
        <span class="statusbar-tools">
            <Switch
                :on="autoOn"
                word="auto"
                :title="
                    autoOn ? 'The agent works through the to-do list without asking' : 'The agent asks before picking up the next to-do'
                "
                @change="setAuto"
            />
        </span>
    </div>
    <TransitionGroup name="planbar">
        <div v-for="p in plans" :key="p.n" :class="['planbar', `planbar-${p.data.status}`]">
            <a class="planbar-link" :href="`#/${route.env}/plan/${p.n}`" :title="`Plan ${p.n}: ${p.title}`">
                <span class="planbar-n">Plan</span>
                <span class="planbar-title">{{ p.title }}</span>
                <span class="planbar-phase">{{ phaseOf(p) }}</span>
                <span class="planbar-track" role="progressbar">
                    <span :style="{width: `${(100 * doneOf(p)) / Math.max(1, p.data.phases.length)}%`}" />
                </span>
            </a>
            <template v-if="button(p)">
                <button type="button" :class="['planbar-act', {ack: p.data.status === 'done'}]" @click="runBar(p)">
                    {{ button(p)[1] }}
                    <Icon name="arrow" />
                </button>
            </template>
            <template v-if="error">
                <span class="planbar-error">{{ error }}</span>
            </template>
        </div>
    </TransitionGroup>
</template>

<style scoped>
.statusbar {
    height: 52px;
    flex: none;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 16px 0 20px;
    position: relative;
    border-bottom: 1px solid var(--border);
    background: #17181b;
    cursor: pointer;
}

.statusbar:hover {
    background: #1b1c20;
}

.statusbar-dot {
    width: 8px;
    height: 8px;
    flex: none;
    border-radius: 50%;
    background: var(--text-3);
}

.statusbar-dot.live {
    background: var(--accent);
}

.statusbar-text {
    flex: 1 1 0%;
    min-width: 0;
    display: flex;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
    margin: 0 -7px;
    padding: 3px 7px;
    border: none;
    border-radius: 7px;
    background: transparent;
    color: var(--text);
    text-align: left;
    cursor: pointer;
}

.statusbar-text b {
    flex: none;
    font-weight: 500;
    font-size: 13.5px;
    margin-right: 8px;
}

.statusbar-roll {
    flex: 0 1 auto;
    min-width: 0;
    position: relative;
    display: flex;
    align-items: baseline;
    font-size: 13px;
    color: var(--text-2);
}

.statusbar-head {
    flex: none;
    white-space: pre;
}

.statusbar-line {
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.roll-enter-active {
    transition:
        opacity 180ms ease,
        transform 180ms cubic-bezier(0.22, 0.7, 0.3, 1);
}

.roll-leave-active {
    position: absolute;
    transition:
        opacity 140ms ease,
        transform 140ms cubic-bezier(0.22, 0.7, 0.3, 1);
}

.roll-enter-from {
    opacity: 0;
    transform: translateY(5px);
}

.roll-leave-to {
    opacity: 0;
    transform: translateY(-5px);
}

.statusbar-running {
    flex: 0 1 auto;
    min-width: 0;
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    align-items: center;
    margin-left: auto;
    padding-left: 14px;
    overflow: hidden;
    font-size: 11px;
    color: var(--text-3);
}

.statusbar-running > * {
    grid-area: 1 / 1;
    justify-self: end;
}

.statusbar-running .roll-leave-active {
    position: static;
}

.statusbar-running .roll-enter-from {
    transform: translateY(10px);
}

.statusbar-running .roll-leave-to {
    transform: translateY(-10px);
}

.statusbar-run-line {
    max-width: 44ch;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    opacity: 0.75;
}

.statusbar-tools {
    flex: 0 1 auto;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 14px;
}

.statusbar-tools::before {
    content: "";
    align-self: stretch;
    width: 1px;
    margin: 3px 0;
    background: rgba(255, 255, 255, 0.14);
}

.planbar {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 30px;
    padding: 0 8px 0 0;
    border-bottom: 1px solid var(--line);
    background: var(--bg-2);
    color: var(--text-2);
    font-size: 11.5px;
}

.planbar-link {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    height: 100%;
    padding: 0 14px 0 20px;
    color: inherit;
}

.planbar-link:hover {
    background: rgba(255, 255, 255, 0.03);
    color: var(--text);
}

.planbar-n {
    flex: none;
    font-weight: 600;
    color: var(--text);
}

.planbar-title {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.planbar-phase {
    flex: none;
    margin-left: auto;
    color: var(--text-3);
    font-size: 11px;
}

.planbar-track {
    flex: none;
    width: 120px;
    height: 4px;
    border-radius: 3px;
    overflow: hidden;
    background: var(--line);
}

.planbar-track > span {
    display: block;
    height: 100%;
    border-radius: 3px;
    background: var(--accent);
    transition: width 0.3s ease;
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

.planbar-error {
    flex: none;
    color: var(--danger);
    font-size: 11px;
}

.planbar-enter-active,
.planbar-leave-active {
    overflow: hidden;
    transition:
        height 0.22s ease,
        opacity 0.18s ease;
}

.planbar-enter-from,
.planbar-leave-to {
    height: 0;
    opacity: 0;
    border-bottom-width: 0;
}
</style>
