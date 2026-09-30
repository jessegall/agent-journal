<script setup>
import {computed, ref, watch} from "vue";
import Icon from "../kit/Icon.vue";
import {ago} from "./ago.js";
import {ordered} from "./waiting.js";

const props = defineProps({waiting: {type: Array, required: true}});
const emit = defineEmits(["open"]);
const open = ref(true);
const KINDS = {question: "Question", plan: "Plan to approve", report: "New report", doc: "New document"};
const sorted = computed(() => ordered(props.waiting));
const summary = computed(() => {
    const count = `${props.waiting.length} ${props.waiting.length === 1 ? "needs" : "need"} you`;
    return props.waiting.length > 1 && props.waiting.some((item) => item.type === "plan") ? `${count}, including a plan` : count;
});

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
            <div class="waiting-head">
                <button type="button" class="waiting-line" :aria-expanded="open" @click="open = !open">
                    <span class="waiting-dot" />
                    {{ summary }}
                    <Icon class="waiting-chevron" name="chevron" :size="14" />
                </button>
                <template v-if="waiting.length > 1">
                    <button type="button" class="waiting-go" @click="pick(sorted[0].ref)">Go through them</button>
                </template>
            </div>
            <template v-if="open">
                <ul class="waiting-list">
                    <template v-for="item in sorted" :key="item.ref">
                        <li>
                            <button type="button" :class="['waiting-item', item.type]" @click="pick(item.ref)">
                                <span class="waiting-mark" />
                                <span class="waiting-words">
                                    <span class="waiting-kind">{{ KINDS[item.type] }} · {{ ago(item.created) }}</span>
                                    <span class="waiting-title">{{ item.title }}</span>
                                </span>
                                <Icon class="waiting-arrow" name="arrow" :size="14" />
                            </button>
                        </li>
                    </template>
                </ul>
            </template>
        </section>
    </template>
</template>

<style scoped>
.waiting {
    max-width: none;
    margin: 0 calc(-1 * var(--side));
    border-bottom: 2px solid var(--line);
}

.waiting-head {
    display: flex;
    align-items: center;
    background: var(--accent-dim);
}

.waiting-line {
    display: flex;
    flex: 1;
    align-items: center;
    gap: 8px;
    min-height: 44px;
    padding: 0 var(--side);
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-weight: 600;
    text-align: left;
}

.waiting-go {
    min-height: 44px;
    padding: 0 var(--side);
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-size: 14px;
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
    padding: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    list-style: none;
}

.waiting-list li + li {
    border-top: 1px solid var(--line);
}

.waiting-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    min-height: 52px;
    padding: 8px var(--side);
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    text-align: left;
}

.waiting-mark {
    flex: none;
    width: 4px;
    align-self: stretch;
    border-radius: 2px;
    background: var(--text-4);
}

.question .waiting-mark {
    background: var(--accent);
}

.plan .waiting-mark {
    background: var(--tone-good);
}

.report .waiting-mark,
.doc .waiting-mark {
    background: var(--tone-warn);
}

.waiting-words {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
    overflow-wrap: anywhere;
}

.waiting-kind {
    color: var(--text-3);
    font-size: 12.5px;
}

.waiting-arrow {
    flex: none;
    color: var(--text-4);
}
</style>
