<script setup>
import {waitingInOrder} from "./waiting.js";
import PhoneNavRow from "./PhoneNavRow.vue";
import {computed} from "vue";
import {ago} from "../format/time.js";
import {kindWaiting} from "./kinds.js";
import PhoneSheet from "./PhoneSheet.vue";

const props = defineProps({waiting: {type: Array, required: true}});
const emit = defineEmits(["open", "close"]);
const sorted = computed(() => waitingInOrder(props.waiting));
</script>

<template>
    <PhoneSheet v-slot="{close}" label="What needs you" @close="emit('close')">
        <h2 class="needs-title">{{ waiting.length }} need you</h2>
        <ul class="needs-list">
            <template v-for="item in sorted" :key="item.ref">
                <li>
                    <PhoneNavRow :class="['needs-row', item.type]" @click="emit('open', item.ref)">
                        <span class="needs-mark" />
                        <span class="needs-words">
                            <span class="needs-name">{{ item.title }}</span>
                            <span class="needs-kind">{{ kindWaiting(item.type) }} · {{ ago(item.created) }}</span>
                        </span>
                    </PhoneNavRow>
                </li>
            </template>
        </ul>
        <button type="button" class="needs-close" @click="close">Close</button>
    </PhoneSheet>
</template>

<style scoped>
.needs-title {
    margin: 4px 0 12px;
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
}

.needs-list {
    margin: 0 0 12px;
    padding: 0;
    overflow: hidden;
    border-radius: 12px;
    background: var(--hover);
    list-style: none;
}

.needs-list li + li {
    border-top: 1px solid var(--line);
}

.needs-row {
    min-height: 56px;
    padding: 8px 16px;
}

.needs-mark {
    flex: none;
    align-self: stretch;
    width: 4px;
    border-radius: 2px;
    background: var(--text-4);
}

.question .needs-mark {
    background: var(--accent);
}

.plan .needs-mark {
    background: var(--tone-good);
}

.report .needs-mark,
.doc .needs-mark {
    background: var(--tone-warn);
}

.needs-words {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.needs-kind {
    color: var(--text-2);
    font-size: 0.765rem;
}

.needs-close {
    min-height: 50px;
    border: 0;
    border-radius: 12px;
    background: var(--hover);
    color: var(--text);
    font: inherit;
    font-weight: 600;
}
</style>
