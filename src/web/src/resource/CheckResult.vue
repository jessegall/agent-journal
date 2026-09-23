<script setup>
import {useCheckRun} from "../composables/checkRun.js";
import Btn from "../kit/Btn.vue";
import Dot from "../kit/Dot.vue";
import {computed, nextTick, ref, watch} from "vue";
import {api} from "../api/client.js";
import {age} from "../format/time.js";
import {useNow} from "../composables/now.js";
import {checkState, seconds, VERDICTS} from "../domain/checks.js";
import CheckProgress from "./CheckProgress.vue";
import CheckRuns from "./CheckRuns.vue";

const props = defineProps({resource: Object});
const now = useNow();
const state = computed(() => checkState(props.resource, now.value));
const last = computed(() => state.value.last);
const command = ref(props.resource.data.command || "");
const every = ref(Number(props.resource.data.every || 0));
const {asked, run} = useCheckRun(() => props.resource);
const output = ref(null);
const passes = computed(() => state.value.runs.filter((r) => r.ok).length);

watch(
    () => props.resource.data.command,
    (value) => (command.value = value || "")
);
watch(
    () => props.resource.data.every,
    (value) => (every.value = Number(value || 0))
);
watch(
    () => state.value.output,
    async () => {
        await nextTick();
        if (output.value) output.value.scrollTop = output.value.scrollHeight;
    }
);


async function save(key, value) {
    if (String(value) === String(props.resource.data[key] ?? "")) return;
    await api.act("check", props.resource.n, "set", {key, value: String(value)});
}
</script>

<template>
    <section :class="['hero', state.verdict]">
        <div class="status">
            <Dot glow :size="12" :pulsing="state.verdict === 'running'" />
            <div class="words">
                <span class="verdict">{{ VERDICTS[state.verdict] }}</span>
                <span class="since">
                    <template v-if="state.verdict === 'running'">started {{ seconds(state.elapsed) }} ago</template>
                    <template v-else-if="last.at">
                        {{ last.ok ? "passed" : `failed with exit ${last.code}` }} {{ age(last.at) }} in
                        {{ seconds(last.took) }}
                    </template>
                    <template v-else>press Run to see where it stands</template>
                </span>
            </div>
            <span class="grow" />
            <Btn
                kind="primary"
                small
                :busy="asked || state.verdict === 'running'"
                :disabled="asked || state.verdict === 'running'"
                @click="run"
            >
                Run now
            </Btn>
        </div>
        <template v-if="state.verdict === 'running'">
            <CheckProgress :state="state" />
        </template>
    </section>
    <section class="block">
        <h3>Configuration</h3>
        <label class="field">
            <span class="label">Command</span>
            <span class="help">Run from the project root; exit 0 passes, anything else fails</span>
            <textarea v-model="command" class="command" rows="2" spellcheck="false" @change="save('command', command)" />
        </label>
        <label class="field inline">
            <span class="text">
                <span class="label">Runs by itself every</span>
                <span class="help">0 runs it only by hand or from its button</span>
            </span>
            <input v-model.number="every" class="every" type="number" min="0" @change="save('every', every)" />
            <span class="unit">minutes</span>
        </label>
    </section>
    <template v-if="state.output">
        <section class="block">
            <h3>{{ state.verdict === "running" ? "Output so far" : "What it said last" }}</h3>
            <pre ref="output" :class="['output', state.verdict]">{{ state.output }}</pre>
        </section>
    </template>
    <template v-if="state.runs.length">
        <section class="block">
            <h3>History</h3>
            <p class="lead">{{ passes }} of the last {{ state.runs.length }} runs passed</p>
            <CheckRuns :runs="state.runs" tall />
            <ul class="history">
                <template v-for="(r, i) in state.runs.slice(0, 8)" :key="i">
                    <li>
                        <span :class="['mark', r.ok ? 'ok' : 'bad']">{{ r.ok ? "Passed" : `Failed · exit ${r.code}` }}</span>
                        <span class="grow" />
                        <span class="meta">{{ seconds(r.took) }} · {{ age(r.at) }}</span>
                    </li>
                </template>
            </ul>
        </section>
    </template>
</template>

<style scoped>
.hero {
    --tone: var(--open);
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 4px 0 18px;
    padding: 16px 18px;
    border: 1px solid color-mix(in srgb, var(--tone) 35%, var(--border));
    border-radius: 12px;
    background: linear-gradient(135deg, color-mix(in srgb, var(--tone) 12%, var(--raised)), var(--raised) 70%);
}

.hero.passed {
    --tone: var(--created);
}

.hero.failed {
    --tone: var(--danger);
}

.hero.running {
    --tone: var(--progress);
}

.status {
    display: flex;
    align-items: center;
    gap: 12px;
}

.words {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.verdict {
    color: var(--tone);
    font-size: 16px;
    font-weight: 600;
}

.since {
    color: var(--text-3);
    font-size: 12px;
}

.grow {
    flex: 1;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 14px;
}

.field.inline {
    flex-direction: row;
    align-items: center;
    gap: 10px;
}

.field .text {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
}

.label {
    font-size: 12.5px;
    font-weight: 500;
}

.help,
.unit,
.lead {
    color: var(--text-3);
    font-size: 12px;
}

.lead {
    margin: 0 0 8px;
}

.command,
.every {
    padding: 7px 9px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: var(--code-bg);
    color: var(--text);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 12px;
}

.command {
    resize: vertical;
}

.every {
    width: 72px;
    text-align: right;
}

.command:focus,
.every:focus {
    border-color: var(--accent);
    outline: none;
}

.output {
    margin: 0;
    padding: 10px 12px;
    max-height: 320px;
    overflow: auto;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--code-bg);
    font-size: 11.5px;
    line-height: 1.5;
    white-space: pre-wrap;
}

.output.failed {
    border-color: color-mix(in srgb, var(--danger) 35%, var(--border-2));
}

.output.running {
    border-color: color-mix(in srgb, var(--progress) 35%, var(--border-2));
}

.history {
    display: flex;
    flex-direction: column;
    margin: 12px 0 0;
    padding: 0;
    list-style: none;
}

.history li {
    display: flex;
    padding: 6px 0;
    border-top: 1px solid var(--line);
    font-size: 12px;
}

.mark.ok {
    color: var(--created);
}

.mark.bad {
    color: var(--danger);
}

.meta {
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
}
</style>
