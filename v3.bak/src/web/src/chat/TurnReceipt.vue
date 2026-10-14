<script setup>
import {useTurnLinks} from "./turnLinks.js";
import {useTurnText} from "./turnText.js";

const props = defineProps({turn: {type: Object, required: true}});
const {env, openChip} = useTurnLinks();
const {html} = useTurnText(() => props.turn, env);
</script>

<template>
    <div class="thread-turn receipt" :data-ref="turn.ref">
        <div class="thread-receipt" @click="openChip" v-html="html" />
    </div>
</template>

<style scoped>
.thread-turn.receipt {
    max-width: 100%;
}

.thread-receipt {
    padding: 0 2px;
    font-size: 12px;
    color: var(--text-3);
}

.thread-receipt :deep(p) {
    margin: 0;
}
</style>
