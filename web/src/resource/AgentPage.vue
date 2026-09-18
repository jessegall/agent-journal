<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import {api} from "../api.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import {route} from "../route.js";
import {rows, span} from "../store.js";
import {render} from "../text/index.js";
import "../text/all.js";
import Trace from "./Trace.vue";

const props = defineProps({resource: Object});
const emit = defineEmits(["close"]);
const data = computed(() => props.resource.data);
const family = computed(() => (data.value.model || "").match(/opus|sonnet|haiku|gpt[-\w.]*/i));
const name = computed(() => ({claude: "Claude Code", codex: "Codex"})[data.value.provider] || "agent");
const works = computed(() =>
    rows("work")
        .filter((w) => w.data.session === props.resource.title || (!w.data.session && !w.completed))
        .slice(-5)
        .reverse()
);
const turns = ref([]);
const scroller = ref(null);
let timer = null;

async function fetchTurns() {
    const since = turns.value.length ? turns.value[turns.value.length - 1].line : 0;
    const fresh = await api("GET", `/${route.value.env}/agent/${props.resource.n}/transcript?since=${since}&last=200`);
    if (!fresh.length) return;
    const atBottom = !scroller.value || scroller.value.scrollHeight - scroller.value.scrollTop - scroller.value.clientHeight < 60;
    turns.value = [...turns.value, ...fresh].slice(-400);
    if (atBottom) requestAnimationFrame(() => scroller.value && (scroller.value.scrollTop = scroller.value.scrollHeight));
}

onMounted(async () => {
    await fetchTurns();
    timer = setInterval(fetchTurns, 3000);
});
onUnmounted(() => clearInterval(timer));
</script>

<template>
    <article class="body agent-page">
        <header class="top">
            <span class="kind">
                <Icon name="agents" :size="13" />
                Agent {{ resource.n }}
            </span>
            <span :class="['state', data.status]">{{ data.status }}</span>
            <span class="grow" />
            <Btn kind="icon" @click="emit('close')"><Icon name="x" /></Btn>
        </header>
        <h2 class="title">{{ family ? `${name} · ${family[0].toLowerCase()}` : name }}</h2>
        <p class="session">session {{ resource.title }}</p>
        <div class="facts">
            <template v-if="data.branch">
                <span class="fact">
                    <Icon name="branch" />
                    {{ data.branch }}
                </span>
            </template>
            <span class="fact">
                <Icon name="reminders" />
                {{ data.started ? `up ${span(Date.now() / 1000 - data.started)}` : "just started" }}
            </span>
            <span class="fact">
                <Icon name="activity" />
                context {{ Math.round(Number(data.context || 0)) }}%
            </span>
            <span class="fact">
                <Icon name="terminal" />
                {{ data.shells || 0 }} shells
            </span>
            <span class="fact">
                <Icon name="agents" />
                {{ data.subagents || 0 }} subagents
            </span>
            <span class="fact">
                <Icon name="book" />
                {{ (data.skills || []).length }} skills
            </span>
        </div>
        <template v-if="(data.skills || []).length">
            <section class="block">
                <h3>Skills loaded in this window</h3>
                <div class="skills">
                    <template v-for="s in data.skills" :key="s">
                        <span class="skill">
                            <Icon name="book" />
                            {{ s }}
                        </span>
                    </template>
                </div>
            </section>
        </template>
        <template v-if="works.length">
            <section class="block">
                <h3>Work</h3>
                <template v-for="w in works" :key="w.n">
                    <div class="work">
                        <span :class="['dot', {open: !w.completed}]" />
                        <span class="work-title">{{ w.title }}</span>
                        <span class="work-when">{{ w.completed ? "ended" : "open" }}</span>
                    </div>
                    <Trace :resource="w" />
                </template>
            </section>
        </template>
        <section class="block">
            <h3>
                Transcript
                <span class="muted">live</span>
            </h3>
            <div ref="scroller" class="transcript">
                <template v-if="!turns.length">
                    <p class="none">Nothing printed yet, or no transcript on this row.</p>
                </template>
                <template v-for="t in turns" :key="t.line">
                    <div :class="['turn', t.who]">
                        <span class="who">{{ t.who }}</span>
                        <div class="said" v-html="render(t.text, {types: []})" />
                    </div>
                </template>
            </div>
        </section>
    </article>
</template>

<style scoped>
.agent-page {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.top {
    display: flex;
    align-items: center;
    gap: 10px;
}

.kind {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--accent-text);
}

.state {
    padding: 1px 7px;
    border-radius: 99px;
    background: var(--raised);
    font-size: 11px;
    color: var(--text-3);
}

.state.working {
    color: #5b8def;
}

.grow {
    flex: 1;
}

.title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
}

.session {
    margin: -6px 0 0;
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 11.5px;
    color: var(--text-3);
}

.facts {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    font-size: 12px;
    color: var(--text-2);
}

.fact {
    display: inline-flex;
    align-items: center;
    gap: 5px;
}

.fact .ico {
    width: 12px;
    height: 12px;
    opacity: 0.65;
}

.block {
    margin-top: 12px;
}

.block h3 {
    margin: 0 0 6px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-3);
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.muted {
    margin-left: 4px;
    font-weight: 400;
}

.skills {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.skill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 2px 8px;
    border: 1px solid var(--border-2);
    border-radius: 99px;
    font-size: 12px;
    color: var(--text-2);
}

.skill .ico {
    width: 12px;
    height: 12px;
}

.work {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0;
}

.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--text-3);
}

.dot.open {
    background: #5b8def;
}

.work-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.work-when {
    font-size: 11.5px;
    color: var(--text-3);
}

.transcript {
    max-height: 60vh;
    overflow-y: auto;
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 9px;
    background: var(--raised);
    font-size: 12.5px;
}

.none {
    margin: 0;
    color: var(--text-3);
}

.turn {
    display: flex;
    gap: 10px;
    padding: 6px 0;
    border-bottom: 1px solid var(--border);
}

.turn:last-child {
    border-bottom: 0;
}

.who {
    flex: none;
    width: 52px;
    font-size: 10.5px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--text-3);
}

.turn.user .who {
    color: var(--accent-text);
}

.said {
    flex: 1;
    min-width: 0;
    color: var(--text-2);
}

.said :deep(p) {
    margin: 0;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

.said :deep(p + p) {
    margin-top: 0.5em;
}
</style>
