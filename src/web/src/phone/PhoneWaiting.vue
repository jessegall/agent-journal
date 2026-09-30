<script setup>
import {computed, ref, watch} from "vue";
import Icon from "../kit/Icon.vue";
import {ago} from "./ago.js";

const props = defineProps({waiting: {type: Array, required: true}});
const emit = defineEmits(["open"]);
const open = ref(true);
const KINDS = {question: "Question", plan: "Plan to approve", report: "New report", doc: "New document"};
const ORDER = ["question", "plan", "report", "doc"];
const sorted = computed(() => [...props.waiting].sort((a, b) => ORDER.indexOf(a.type) - ORDER.indexOf(b.type) || b.created - a.created));

watch(
    () => props.waiting.map((item) => item.ref),
    (now, before) => now.some((ref) => !before.includes(ref)) && (open.value = true),
);

function pick(target) {
    open.value = false;
    emit("open", target);
}
</script>

<template>
    <template v-if="waiting.length">
        <section :class="['waiting', {open}]">
            <button type="button" class="waiting-line" :aria-expanded="open" @click="open = !open">
                <span class="waiting-dot" />
                {{ waiting.length }} {{ waiting.length === 1 ? "needs" : "need" }} you
                <Icon class="waiting-chevron" name="chevron" :size="14" />
            </button>
            <template v-if="open">
                <ul class="waiting-list">
                    <template v-for="item in sorted" :key="item.ref">
                        <li>
                            <button type="button" :class="['waiting-item', item.type]" @click="pick(item.ref)">
                                <span class="waiting-kind">{{ KINDS[item.type] }} · {{ ago(item.created) }}</span>
                                <span class="waiting-title">{{ item.title }}</span>
                            </button>
                        </li>
                    </template>
                </ul>
            </template>
        </section>
    </template>
</template>

<style scoped>
.waiting-item.question {
    border-left: 3px solid var(--accent);
    border-radius: 0 10px 10px 0;
}

.waiting {
    max-width: none;
    margin: 0 calc(-1 * var(--side));
    border-bottom: 1px solid var(--line);
    border-left: 4px solid var(--accent);
    background: var(--accent-dim);
}

.waiting-line {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    min-height: 44px;
    padding: 0 var(--side);
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-weight: 600;
    text-align: left;
}

.waiting-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent);
}

.waiting-chevron {
    margin-left: auto;
    transform: rotate(90deg);
    transition: transform var(--move);
}

.open .waiting-chevron {
    transform: rotate(-90deg);
}

.waiting-list {
    max-height: 55dvh;
    margin: 0;
    padding: 0 8px 8px;
    overflow-y: auto;
    overscroll-behavior: contain;
    list-style: none;
}

.waiting-item {
    display: flex;
    min-width: 0;
    overflow-wrap: anywhere;
    flex-direction: column;
    gap: 2px;
    width: 100%;
    min-height: 44px;
    padding: 8px;
    border: 0;
    border-radius: 10px;
    background: none;
    color: var(--text);
    font: inherit;
    text-align: left;
}

.waiting-kind {
    color: var(--text-3);
    font-size: 12.5px;
}
</style>
