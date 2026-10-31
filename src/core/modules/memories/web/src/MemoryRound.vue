<script setup>
import {computed, ref} from "vue";
import {FoldGroup, useWindow} from "@journal/window-kit";
import {roundOf} from "./round.js";

// one compaction's round of memories, as its mark keeps it, in two groups shut until clicked: those still shown, and those faded out
const window = useWindow();
const mark = window.option("row");
const parts = computed(() => roundOf(mark.value?.lines) || []);
const opened = ref(new Set());

function toggle(label) {
    const next = new Set(opened.value);
    if (!next.delete(label)) next.add(label);
    opened.value = next;
}
</script>

<template>
    <div class="memory-round">
        <template v-for="part in parts" :key="part.label">
            <FoldGroup :label="part.label" :count="part.rows.length" :open="opened.has(part.label)" flush @toggle="toggle(part.label)">
                <ul class="memory-round-rows">
                    <template v-for="memory in part.rows" :key="memory.id">
                        <li class="memory-round-row">
                            <button type="button" class="memory-round-ref" @click.stop="window.open('memories.list')">Memory {{ memory.id }}</button>
                            <span class="memory-round-weight">{{ memory.change }}</span>
                        </li>
                    </template>
                </ul>
            </FoldGroup>
        </template>
    </div>
</template>

<style scoped>
.memory-round {
    margin: 0 0 0 20px;
}

.memory-round-rows {
    margin: 0;
    padding: 0;
    list-style: none;
}

.memory-round-row {
    display: flex;
    flex-wrap: wrap;
    gap: 2px 8px;
    padding: 2px 0;
    color: var(--text-2);
    font-size: 12px;
    line-height: 1.45;
    overflow-wrap: anywhere;
}

.memory-round-ref {
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    cursor: pointer;
}

.memory-round-weight {
    color: var(--text-4);
}
</style>
