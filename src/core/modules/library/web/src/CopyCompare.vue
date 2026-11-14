<script setup>
import {computed} from "vue";
import {DiffCard} from "@journal/window-kit";
import {diffRows} from "./copyDiff.js";

// the text on this journal against the library's text, field by field: red lines are only here, green lines are only in the library
const props = defineProps({here: {type: Object, required: true}, library: {type: Object, required: true}, at: {type: String, required: true}});

const cards = computed(() =>
    Object.keys({...props.here, ...props.library})
        .map((name) => ({name, ...diffRows(String(props.here[name] ?? ""), String(props.library[name] ?? ""))}))
        .filter((card) => card.added || card.removed)
);
</script>

<template>
    <div class="compare" data-library-compare>
        <p class="compare-help">Red lines are only on this journal. Green lines are only in the library.</p>
        <template v-if="!cards.length">
            <p data-library-same>The two versions have the same text.</p>
        </template>
        <template v-for="card in cards" :key="card.name">
            <DiffCard :path="card.name" change="edit" :added="card.added" :removed="card.removed" :at="at" :rows="card.rows" data-library-diff />
        </template>
    </div>
</template>

<style scoped>
.compare {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.compare-help {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
