<script setup>
defineProps({meaning: {type: String, default: ""}});
</script>

<template>
    <span :class="['stage-dot', meaning]" />
</template>

<style scoped>
.stage-dot {
    flex: none;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--border-3);
}

.stage-dot.start {
    background: var(--progress);
}

.stage-dot.review {
    background: var(--tone-warn);
}

.stage-dot.done {
    background: var(--tone-good);
}
</style>
