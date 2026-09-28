<script setup>
import {computed, ref} from "vue";
import Btn from "../kit/Btn.vue";
import {KINDS} from "../composables/shares.js";

const props = defineProps({opens: {type: Array, default: null}});
const listed = ref(false);
const NOUNS = {todo: "to-do", doc: "document"};
const nounOf = (type) => NOUNS[type] || KINDS[type] || type;
const summary = computed(() => {
    if (!props.opens || !props.opens.length) return null;
    const [first, ...rest] = props.opens;
    const named = /^(.*) \((\w+) (\d+)\)$/.exec(first);
    const files = rest.filter((line) => line.startsWith("its "));
    const types = rest.filter((line) => !line.startsWith("its ")).map((line) => (/\((\w+) \d+\)$/.exec(line) || [])[1] || "");
    const noun = new Set(types).size === 1 ? nounOf(types[0]) : "item";
    const members = types.length ? [`its ${types.length} ${noun}${types.length === 1 ? "" : "s"}`] : [];
    return {
        title: named ? named[1] : first,
        ref: named ? ` (${nounOf(named[2])} ${named[3]})` : "",
        tail: `${[...files, ...members]
            .map((part) => ` and ${part}`)
            .join("")
            .replace(" and its ", ", its ")}, and nothing else.`,
    };
});
</script>

<template>
    <template v-if="opens === null">
        <p class="quiet">Working out what the link opens…</p>
    </template>
    <template v-else-if="summary">
        <div class="opens">
            <p class="opens-line">
                <span>The link opens</span>
                <strong>{{ summary.title }}</strong>
                <span class="ref">{{ summary.ref }}</span>
                <span>{{ summary.tail }}</span>
                <template v-if="opens.length > 1">
                    <Btn kind="icon" small class="show" @click="listed = !listed">
                        {{ listed ? "Hide" : "Show" }}
                    </Btn>
                </template>
            </p>
            <template v-if="listed">
                <ul class="opens-list">
                    <template v-for="line in opens.slice(1)" :key="line">
                        <li>{{ line }}</li>
                    </template>
                </ul>
            </template>
        </div>
    </template>
</template>

<style scoped>
.opens-line {
    margin: 0;
    color: var(--text-2);
    font-size: 13px;
    line-height: 1.55;
}

.opens-line strong {
    margin-left: 0.3em;
    color: var(--text);
    font-weight: 500;
}

.ref {
    color: var(--text-3);
}

.show.btn,
.show.btn:hover {
    height: auto;
    margin-left: 6px;
    padding: 0;
    background: none;
    color: var(--accent-text);
    font-size: 12.5px;
    vertical-align: baseline;
}

.opens-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 8px 0 0;
    padding: 0 0 0 14px;
    color: var(--text-3);
    font-size: 12.5px;
    line-height: 1.45;
    max-height: 120px;
    overflow-y: auto;
}

.quiet,
.meta {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
