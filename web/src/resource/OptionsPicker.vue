<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import OptionList from "../kit/OptionList.vue";
import {word} from "../state/store.js";
import {words} from "../text/markers.js";

const props = defineProps({resource: Object});
const own = ref("");
const changing = ref(false);
const optionText = (option = {}) => String(option.title || option.label || option.value || "");
const options = computed(() =>
    (Array.isArray(props.resource.data.options) ? props.resource.data.options : []).map((option) => {
        const value = option && typeof option === "object" ? option : {};
        return {...value, title: optionText(value), code: value.code ?? value.value ?? ""};
    })
);
const pick = computed(() => props.resource.data.pick || 0);
const settled = computed(() => !!props.resource.completed && !changing.value);
const ownWords = computed(() => settled.value && !options.value.some((o) => o.title === props.resource.outcome));

async function submit(text) {
    const choice = String(text || "").trim();
    if (!choice) return;
    if (props.resource.completed) await api.act(props.resource.type, props.resource.n, "set", {key: "outcome", value: choice});
    else await api.act(props.resource.type, props.resource.n, word(props.resource.type, "complete"), {how: choice});
    changing.value = false;
}
</script>

<template>
    <section class="options">
        <OptionList
            :options="options"
            :chosen="resource.completed ? resource.outcome : ''"
            :chosen-by="resource.data.answered_by || ''"
            :reason="resource.data.reason || ''"
            :suggested="pick - 1"
            :disabled="settled"
            @pick="(i) => submit(options[i].title)"
        />
        <template v-if="settled">
            <template v-if="ownWords">
                <div class="own-words">
                    <span>Your own words</span>
                    <span class="own-words-text">{{ words(resource.outcome) }}</span>
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
.own-words {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 9px 12px;
    border: 1px solid var(--accent);
    border-radius: 8px;
    background: color-mix(in srgb, var(--accent) 12%, var(--raised));
}

.own-words-text {
    color: var(--text-3);
    font-size: 12.5px;
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
