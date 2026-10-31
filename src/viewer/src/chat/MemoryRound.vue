<script setup>
// one compaction's round of memories, as its mark keeps it, in two groups shut until clicked: those still shown, and those removed, faded out or taken out since the last round
import {computed, ref} from "vue";
import {useTurnLinks} from "./turnLinks.js";
import FoldGroup from "../kit/FoldGroup.vue";

const props = defineProps({round: {type: Object, default: null}});
const {openRef} = useTurnLinks();
const opened = ref(new Set());

const parts = computed(() =>
    props.round
        ? [
              {label: "Still shown", rows: (props.round.shown || []).map((m) => ({...m, change: `weight ${m.weight_before} to ${m.weight_after}`}))},
              {
                  label: "Removed",
                  rows: [
                      ...(props.round.faded || []).map((m) => ({...m, change: "faded out at weight 0"})),
                      ...(props.round.removed || []).map((m) => ({...m, change: m.end_reason || "taken out"})),
                  ],
              },
          ].filter((part) => part.rows.length)
        : []
);

function toggle(label) {
    const next = new Set(opened.value);
    next.has(label) ? next.delete(label) : next.add(label);
    opened.value = next;
}
</script>

<template>
    <div class="memory-round">
        <template v-if="!round">
            <p class="memory-round-missing">This round was not recorded: the mark was written before rounds were kept.</p>
        </template>
        <template v-for="part in parts" :key="part.label">
            <FoldGroup :label="part.label" :count="part.rows.length" :open="opened.has(part.label)" flush @toggle="toggle(part.label)">
                <ul class="memory-round-rows">
                    <template v-for="memory in part.rows" :key="memory.id">
                        <li class="memory-round-row" @click.stop="openRef(`memories:${memory.id}`)">
                            <button type="button" class="memory-round-ref">Memory {{ memory.id }}</button>
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

.memory-round-missing {
    margin: 4px 0 0;
    color: var(--text-2);
    font-size: 12px;
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
    cursor: pointer;
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
