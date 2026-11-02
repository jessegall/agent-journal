<script setup>
import {onBeforeUnmount, onMounted, ref} from "vue";
import CommentSide from "./CommentSide.vue";

const SIDEBAR_FROM = 600;

// a body with its comments: in a column beside it when the box is wide enough, below it when the box is narrow
defineProps({open: Boolean, comments: {type: Array, required: true}, words: {type: Function, required: true}});
defineEmits(["close"]);
const root = ref(null);
const below = ref(false);
const watcher = new ResizeObserver(([entry]) => (below.value = entry.contentRect.width < SIDEBAR_FROM));
onMounted(() => watcher.observe(root.value));
onBeforeUnmount(() => watcher.disconnect());
</script>

<template>
    <div ref="root" :class="['commented-row', {below}]" :data-comments-below="below || null">
        <slot />
        <template v-if="open">
            <CommentSide :comments="comments" :words="words" :below="below" @close="$emit('close')" />
        </template>
    </div>
</template>

<style scoped>
.commented-row {
    display: flex;
    flex: 1;
    min-height: 0;
}

.commented-row.below {
    flex-direction: column;
}

.commented-row > :slotted(*) {
    flex: 1;
    min-width: 0;
}
</style>
