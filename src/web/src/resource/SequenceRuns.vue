<script setup>
import {inject} from "vue";
import CloseButton from "../kit/CloseButton.vue";
import {peek} from "../route.js";
import {useRuns} from "../composables/sequenceRuns.js";
import {useWriting} from "../composables/writing.js";

const props = defineProps({resource: Object, panel: Boolean});
const BY_HAND = "by hand";
const runs = useRuns(() => props.resource);
const writing = useWriting(() => props.resource.ref);
const talk = inject("talk", null);

function open(ref) {
    const [type, n] = ref.split(":");
    peek(type, Number(n));
}
</script>

<template>
    <template v-if="runs.length">
        <section :class="['runs', {panel}]">
            <template v-if="panel">
                <header class="panel-head">
                    <div class="panel-top">
                        <h2 class="panel-title">
                            <span class="pulse" />
                            Being written
                        </h2>
                        <template v-if="talk">
                            <CloseButton title="Close this panel" @click="talk.toggle('running')" />
                        </template>
                    </div>
                    <p class="panel-note">The agent is writing this now. Comments open when it is done.</p>
                    <template v-if="writing?.section">
                        <p class="panel-where">
                            Last wrote
                            <b>{{ writing.section }}</b>
                        </p>
                    </template>
                </header>
            </template>
            <template v-else>
                <h3>Running now</h3>
            </template>
            <template v-for="r in runs" :key="`${r.sequence.n}-${r.about}`">
                <div class="run">
                    <div class="run-head">
                        <template v-if="resource.type === 'sequence'">
                            <span>{{ r.about === BY_HAND ? "Started by hand" : "About" }}</span>
                            <template v-if="r.about !== BY_HAND">
                                <button type="button" class="run-link" @click="open(r.about)">{{ r.about.replace(":", " ") }}</button>
                            </template>
                        </template>
                        <template v-else>
                            <button type="button" class="run-link" @click="open(r.sequence.ref)">{{ r.sequence.title }}</button>
                        </template>
                        <span class="grow" />
                        <span class="run-count">
                            {{ r.waiting ? "waiting its turn" : `step ${r.step} of ${r.titles.length}` }}
                        </span>
                    </div>
                    <ol class="steps">
                        <template v-for="(title, i) in r.titles" :key="`${i}-${title}`">
                            <li :class="{done: i + 1 < r.step, current: !r.waiting && i + 1 === r.step}">
                                <span class="step-mark" />
                                {{ title }}
                            </li>
                        </template>
                    </ol>
                </div>
            </template>
        </section>
    </template>
</template>

<style scoped>
.runs {
    margin-top: 20px;
}

h3 {
    margin: 0 0 8px;
    color: var(--text-3);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.run {
    margin-bottom: 10px;
    padding: 12px 14px;
    border: 1px solid color-mix(in srgb, var(--accent) 40%, var(--border-2));
    border-radius: 9px;
    background: var(--raised);
}

.run-head {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--text-2);
    font-size: 12.5px;
}

.grow {
    flex: 1;
}

.run-link {
    padding: 0;
    border: none;
    background: none;
    color: var(--accent-text);
    font: inherit;
    cursor: pointer;
}

.run-count {
    color: var(--text-3);
    font-size: 11.5px;
    font-variant-numeric: tabular-nums;
}

.steps {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin: 10px 0 0;
    padding-left: 20px;
    color: var(--text-3);
    font-size: 12.5px;
}

.steps .done {
    text-decoration: line-through;
}

.steps .current {
    color: var(--text);
    font-weight: 500;
}

.step-mark {
    display: none;
}

.runs.panel {
    margin: 0;
    padding: 16px 16px 20px;
}

.panel-head {
    margin-bottom: 14px;
}

.panel-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin: -4px 0 0;
}

.panel-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    color: var(--text);
    font-size: 13px;
    font-weight: 600;
}

.pulse {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent);
    animation: pulse 1.4s ease-in-out infinite;
}

@keyframes pulse {
    50% {
        box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 25%, transparent);
    }
}

.panel-note {
    margin: 6px 0 0;
    color: var(--text-3);
    font-size: 12.5px;
    line-height: 1.5;
}

.panel-where {
    margin: 10px 0 0;
    padding: 7px 10px;
    border-radius: 7px;
    background: var(--accent-dim);
    color: var(--text-2);
    font-size: 12.5px;
}

.panel-where b {
    color: var(--text);
    font-weight: 500;
}

.panel .steps {
    gap: 0;
    padding-left: 0;
    list-style: none;
}

.panel .steps li {
    position: relative;
    display: flex;
    align-items: baseline;
    gap: 10px;
    padding: 5px 0;
    text-decoration: none;
}

.panel .steps li:not(:last-child)::after {
    position: absolute;
    top: 17px;
    bottom: -5px;
    left: 4px;
    width: 1px;
    background: var(--border-2);
    content: "";
}

.panel .step-mark {
    position: relative;
    top: 1px;
    display: block;
    flex: none;
    width: 9px;
    height: 9px;
    border: 1.5px solid var(--border-3);
    border-radius: 50%;
    box-sizing: border-box;
}

.panel .done .step-mark {
    border-color: var(--tone-good);
    background: var(--tone-good);
}

.panel .current .step-mark {
    border-color: var(--accent);
    background: var(--accent);
    animation: pulse 1.4s ease-in-out infinite;
}
</style>
