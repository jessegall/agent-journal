<script setup>
import {computed, onUnmounted, ref} from "vue";
import {act} from "../api.js";
import Btn from "../kit/Btn.vue";
import {route} from "../route.js";
import {store, word} from "../store.js";

const HOLD_SECONDS = 3;
const props = defineProps({resource: Object});
const holdingPick = ref(-1);
let holdTimer = 0;
const own = ref("");
const changing = ref(false);
const optionText = (option = {}) => String(option.title || option.label || option.value || "");
const options = computed(() =>
    (Array.isArray(props.resource.data.options) ? props.resource.data.options : []).map((option) => {
        const value = option && typeof option === "object" ? option : {};
        return {...value, title: optionText(value), code: value.code ?? value.value ?? ""};
    })
);
const held = computed(() => Number((store.settings && store.settings.questions && store.settings.questions.hold) ?? HOLD_SECONDS) * 1000);
const pick = computed(() => props.resource.data.pick || 0);
const settled = computed(() => !!props.resource.completed && !changing.value);
const ownWords = computed(() => settled.value && !options.value.some((o) => o.title === props.resource.outcome));

async function submit(text) {
    const choice = String(text || "").trim();
    if (!choice) return;
    clearTimeout(holdTimer);
    holdingPick.value = -1;
    if (props.resource.completed) await act(route.value.env, props.resource.type, props.resource.n, "set", {key: "outcome", value: choice});
    else await act(route.value.env, props.resource.type, props.resource.n, word(props.resource.type, "complete"), {how: choice});
    changing.value = false;
}

function choose(i) {
    clearTimeout(holdTimer);
    if (holdingPick.value === i) {
        holdingPick.value = -1;
        return;
    }
    holdingPick.value = i;
    holdTimer = setTimeout(save, held.value);
}

function save() {
    const i = holdingPick.value;
    clearTimeout(holdTimer);
    holdingPick.value = -1;
    if (i >= 0) submit(options.value[i].title);
}

onUnmounted(save);
</script>

<template>
    <section class="options">
        <template v-for="(o, i) in options" :key="i">
            <button
                type="button"
                :class="[
                    'option',
                    {picked: i + 1 === pick && !settled, chosen: resource.outcome === o.title, holdingPick: holdingPick === i},
                ]"
                :disabled="settled"
                @click="choose(i)"
            >
                <template v-if="i + 1 === pick && !settled">
                    <span class="pick">The agent's pick</span>
                </template>
                <span class="label">{{ o.title }}</span>
                <template v-if="o.description">
                    <span class="desc">{{ o.description }}</span>
                </template>
                <template v-if="o.code">
                    <code class="code">{{ o.code }}</code>
                </template>
                <template v-if="holdingPick === i">
                    <span class="hold-note">Saving this choice… click it again to cancel</span>
                    <span class="hold-bar" :style="{'--hold': `${held}ms`}" />
                </template>
            </button>
        </template>
        <template v-if="settled">
            <template v-if="ownWords">
                <div class="option chosen">
                    <span class="label">Your own words</span>
                    <span class="desc">{{ resource.outcome }}</span>
                </div>
            </template>
            <div class="after">
                <Btn small @click="changing = true">Change choice</Btn>
            </div>
        </template>
        <template v-else>
            <form class="own" @submit.prevent="submit(own)">
                <input v-model="own" placeholder="Or choice in your own words…" />
                <Btn kind="primary" small @click="submit(own)">{{ word(resource.type, "complete") }}</Btn>
                <template v-if="changing">
                    <Btn small @click="changing = false">Keep it</Btn>
                </template>
            </form>
        </template>
    </section>
</template>

<style scoped>
.options {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 12px 0;
}
.option {
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 9px 12px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--raised);
    text-align: left;
    cursor: pointer;
}
.option:hover:not(:disabled) {
    border-color: var(--accent);
}
.option.picked {
    border-color: var(--accent-dim);
}
.option.chosen {
    border-color: var(--accent);
    background: color-mix(in srgb, var(--accent) 12%, var(--raised));
}
.option.holdingPick {
    border-color: var(--accent);
}

.hold-note {
    color: var(--accent-text);
    font-size: 11.5px;
}

.hold-bar {
    position: absolute;
    z-index: 5;
    top: 0;
    left: 0;
    height: 2px;
    background: var(--progress);
    animation: hold var(--hold) linear forwards;
}

@keyframes hold {
    from {
        width: 0;
    }

    to {
        width: 100%;
    }
}

.option:disabled {
    cursor: default;
    opacity: 0.7;
}
.label {
    display: flex;
    justify-content: space-between;
    gap: 8px;
}
.pick {
    display: block;
    margin: -9px -12px 8px;
    padding: 4px 12px;
    border-radius: 7px 7px 0 0;
    background: color-mix(in srgb, var(--accent) 22%, var(--raised));
    color: var(--accent-text);
    font-size: 11px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}
.desc {
    color: var(--text-3);
    font-size: 12.5px;
}
.code {
    font-family: ui-monospace, monospace;
    font-size: 12px;
    color: var(--text-2);
    white-space: pre-wrap;
}
.answer {
    display: flex;
    flex-direction: column;
    border: 1px solid color-mix(in srgb, var(--accent) 55%, transparent);
    border-radius: 8px;
    background: color-mix(in srgb, var(--accent) 14%, transparent);
    overflow: hidden;
}

.answer-label {
    padding: 6px 12px;
    border-bottom: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
    font-size: 11px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--accent-text);
}

.answer-text {
    padding: 9px 12px;
    white-space: pre-wrap;
}

.after {
    display: flex;
    justify-content: flex-end;
}

.own {
    display: flex;
    gap: 6px;
}
.own input {
    flex: 1;
    padding: 6px 10px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--bg);
}
</style>
