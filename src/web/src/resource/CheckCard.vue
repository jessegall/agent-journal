<script setup>
import Btn from "../kit/Btn.vue";
import Dot from "../kit/Dot.vue";
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {age} from "../format/time.js";
import {useNow} from "../composables/now.js";
import {checkState, seconds, VERDICTS} from "../domain/checks.js";
import CheckProgress from "./CheckProgress.vue";
import CheckRuns from "./CheckRuns.vue";

const props = defineProps({resource: Object});
const now = useNow();
const state = computed(() => checkState(props.resource, now.value));
const every = computed(() => Number(props.resource.data.every || 0));
const asked = ref(false);

async function run() {
    asked.value = true;
    try {
        await api.act("check", props.resource.n, "run");
    } finally {
        asked.value = false;
    }
}
</script>

<template>
    <div :class="['check', state.verdict]" role="button" tabindex="0">
        <div class="head">
            <Dot glow :size="8" :pulsing="state.verdict === 'running'" />
            <span class="verdict">{{ VERDICTS[state.verdict] }}</span>
            <span class="n">#{{ resource.n }}</span>
            <span class="grow" />
            <Btn
                kind="primary"
                small
                :busy="asked || state.verdict === 'running'"
                :disabled="asked || state.verdict === 'running'"
                @click.stop="run"
            >
                Run
            </Btn>
        </div>
        <span class="title">{{ resource.title }}</span>
        <code class="command">{{ resource.data.command || "no command yet" }}</code>
        <template v-if="state.verdict === 'running'">
            <CheckProgress :state="state" />
        </template>
        <template v-else>
            <div class="foot">
                <CheckRuns :runs="state.runs" />
                <span class="grow" />
                <span class="when">
                    <template v-if="state.last.at">{{ age(state.last.at) }} · {{ seconds(state.last.took) }}</template>
                    <template v-else>{{ every ? `every ${every} min` : "by hand" }}</template>
                </span>
            </div>
        </template>
    </div>
</template>

<style scoped>
.check {
    --tone: var(--open);
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-height: 150px;
    padding: 14px 16px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: linear-gradient(180deg, color-mix(in srgb, var(--tone) 7%, var(--raised)), var(--raised) 60%);
    text-align: left;
    cursor: pointer;
    transition:
        border-color 0.2s,
        background 0.2s;
}

.check:hover {
    border-color: var(--border-3);
}

.check.passed {
    --tone: var(--created);
}

.check.failed {
    --tone: var(--danger);
    border-color: color-mix(in srgb, var(--danger) 35%, var(--border));
}

.check.running {
    --tone: var(--progress);
    border-color: color-mix(in srgb, var(--progress) 45%, var(--border));
}

.head {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
}

.verdict {
    color: var(--tone);
    font-weight: 500;
}

.n {
    color: var(--text-4);
}

.grow {
    flex: 1;
}

.title {
    font-weight: 500;
    line-height: 1.35;
}

.command {
    overflow: hidden;
    color: var(--text-3);
    font-size: 11.5px;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.foot {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    margin-top: auto;
}

.when {
    color: var(--text-3);
    font-size: 11.5px;
    white-space: nowrap;
}
</style>
