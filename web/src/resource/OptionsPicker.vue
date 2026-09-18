<script setup>
import {computed, ref} from "vue";
import {act} from "../api.js";
import Btn from "../kit/Btn.vue";
import {route} from "../route.js";
import {reload, word} from "../store.js";

const props = defineProps({resource: Object});
const own = ref("");
const changing = ref(false);
const options = computed(() => props.resource.data.options || []);
const pick = computed(() => props.resource.data.pick || 0);
const settled = computed(() => !!props.resource.completed && !changing.value);

async function submit(text) {
    if (!text.trim()) return;
    if (props.resource.completed) await act(route.value.env, props.resource.type, props.resource.n, "set", {key: "outcome", value: text});
    else await act(route.value.env, props.resource.type, props.resource.n, word(props.resource.type, "complete"), {how: text});
    changing.value = false;
    await reload();
}
</script>

<template>
    <section class="options">
        <template v-for="(o, i) in options" :key="i">
            <button
                type="button"
                :class="['option', {picked: i + 1 === pick && !settled, chosen: resource.outcome === o.title}]"
                :disabled="settled"
                @click="submit(o.title)"
            >
                <span class="label">
                    {{ o.title }}
                    <template v-if="i + 1 === pick && !settled">
                        <span class="pick">the agent's pick</span>
                    </template>
                </span>
                <template v-if="o.description">
                    <span class="desc">{{ o.description }}</span>
                </template>
                <template v-if="o.code">
                    <code class="code">{{ o.code }}</code>
                </template>
            </button>
        </template>
        <template v-if="settled">
            <div class="answer">
                <span class="answer-label">Your answer</span>
                <span class="answer-text">{{ resource.outcome }}</span>
            </div>
            <Btn small @click="changing = true">Change answer</Btn>
        </template>
        <template v-else>
            <form class="own" @submit.prevent="submit(own)">
                <input v-model="own" placeholder="Or answer in your own words…" />
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
    color: var(--accent-text);
    font-size: 11.5px;
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
