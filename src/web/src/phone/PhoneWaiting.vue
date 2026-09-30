<script setup>
import {ref} from "vue";
import Icon from "../kit/Icon.vue";

defineProps({waiting: {type: Array, required: true}});
const emit = defineEmits(["open"]);
const open = ref(false);
const KINDS = {question: "Question", plan: "Plan to approve", report: "New report", doc: "New document"};

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
                    <template v-for="item in waiting" :key="item.ref">
                        <li>
                            <button type="button" class="waiting-item" @click="pick(item.ref)">
                                <span class="waiting-kind">{{ KINDS[item.type] }}</span>
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
.waiting {
    margin: 0 -16px;
    border-bottom: 1px solid var(--line);
    background: var(--accent-dim);
}

.waiting-line {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    min-height: 44px;
    padding: 0 16px;
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
    margin: 0;
    padding: 0 8px 8px;
    list-style: none;
}

.waiting-item {
    display: flex;
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
