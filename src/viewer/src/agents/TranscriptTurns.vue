<script setup>
import {computed, ref} from "vue";
import Icon from "../kit/Icon.vue";
import Skeleton from "../kit/Skeleton.vue";
import {useToggledSet} from "../composables/toggledSet.js";
import {saidTurns} from "../domain/transcript.js";
import {clock} from "../format/time.js";
import {render} from "../text/index.js";
import "../text/all.js";
import {route} from "../route.js";

const props = defineProps({
    transcript: {type: Object, required: true},
    speakers: {type: Object, required: true},
    env: {type: String, default: ""},
});
const {turns, folded, bodies, opening, loading, atStart, toggle, earlier, scrolled} = props.transcript;
const said = computed(() => saidTurns(turns.value, props.speakers));
// the turns whose steps are shown, each folded under its message until opened
const {members: unfolded, toggle: flip} = useToggledSet();
const stepsWord = (n) => `Show ${n} ${n === 1 ? "step" : "steps"}`;
const scroller = ref(null);
defineExpose({scroller});
</script>

<template>
    <div ref="scroller" class="tx" @scroll="scrolled">
        <template v-if="!atStart && turns.length">
            <button type="button" class="earlier" @click="earlier()">Show earlier</button>
        </template>
        <template v-if="loading && !turns.length">
            <Skeleton label="Loading the transcript" />
        </template>
        <template v-else-if="!said.length">
            <p class="none">Nothing said yet.</p>
        </template>
        <template v-for="turn in said" :key="turn.key">
            <div class="said">
                <div class="who">
                    {{ turn.who }}
                    <span>{{ clock(turn.time) }}</span>
                </div>
                <template v-if="turn.text">
                    <div class="text" v-html="render(turn.text, {types: [], env: env || route.env})" />
                </template>
                <template v-if="turn.steps.length">
                    <button type="button" class="fold" @click="flip(turn.key)">{{ unfolded.has(turn.key) ? "Hide the steps" : stepsWord(turn.steps.length) }}</button>
                </template>
                <template v-if="unfolded.has(turn.key)">
                    <div class="steps">
                        <template v-for="(step, i) in turn.steps" :key="i">
                            <div class="step">
                                <Icon :name="step.icon" :size="13" />
                                <span class="said-step" :title="step.code">
                                    {{ step.words }}
                                    <template v-if="step.code">
                                        <code>{{ step.code }}</code>
                                    </template>
                                    <template v-if="step.rest">{{ step.code ? `, ${step.rest}` : ` ${step.rest}` }}</template>
                                </span>
                                <template v-if="step.shell && step.output">
                                    <button type="button" class="out" @click="toggle(step.output)">
                                        {{ folded.has(step.output) ? "Output" : "Hide output" }}
                                    </button>
                                </template>
                                <template v-if="step.output && !folded.has(step.output)">
                                    <pre class="output">{{ opening.has(step.output) ? "Loading…" : bodies[step.output] }}</pre>
                                </template>
                            </div>
                        </template>
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>

<style scoped>
.tx {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 18px;
    min-height: 0;
    overflow-y: auto;
    padding: 4px 16px 16px;
    scrollbar-width: thin;
}

.earlier {
    align-self: flex-start;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-3);
    font: 12px var(--font);
    cursor: pointer;
}

.fold {
    margin-top: 4px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-3);
    font: 11.5px var(--font);
    text-decoration: underline;
    text-decoration-color: var(--border-3);
    text-underline-offset: 3px;
    cursor: pointer;
}

.fold:hover,
.earlier:hover {
    color: var(--text);
}

.none {
    margin: 0;
    color: var(--text-3);
    font-size: 12.5px;
}

.who {
    display: flex;
    align-items: baseline;
    gap: 6px;
    margin-bottom: 2px;
    color: var(--text-2);
    font-size: 12px;
    font-weight: 500;
}

.who span {
    color: var(--text-4);
    font: 400 11px var(--mono);
}

.text {
    color: var(--text);
    overflow-wrap: anywhere;
    text-wrap: pretty;
}

.text :deep(p) {
    margin: 0 0 6px;
}

.text :deep(p:last-child) {
    margin-bottom: 0;
}

.steps {
    display: flex;
    flex-direction: column;
    margin-top: 6px;
}

.step {
    display: grid;
    grid-template-columns: 13px minmax(0, 1fr) auto;
    gap: 9px;
    align-items: baseline;
    padding: 3px 0;
    color: var(--text-3);
    font-size: 12px;
}

.step > :first-child {
    color: var(--text-4);
    transform: translateY(2px);
}

.said-step {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.step code {
    color: var(--text-2);
    font: 11.5px var(--mono);
    word-break: break-word;
}

.out {
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-4);
    font: 11.5px var(--font);
    white-space: nowrap;
    cursor: pointer;
}

.out:hover {
    color: var(--text);
}

.output {
    grid-column: 2 / -1;
    max-height: 240px;
    margin: 4px 0 2px;
    overflow: auto;
    padding: 8px 10px;
    border: 1px solid var(--border);
    border-radius: 7px;
    color: var(--text-2);
    font: 11.5px var(--mono);
    white-space: pre-wrap;
    scrollbar-width: thin;
}
</style>
