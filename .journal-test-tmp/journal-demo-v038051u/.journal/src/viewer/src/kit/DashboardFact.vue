<script setup>
import TextDisplay from "./TextDisplay.vue";

defineProps({label: {type: String, required: true}, body: {type: String, required: true}});
</script>

<template>
    <div class="fact">
        <span class="fact-label">{{ label }}</span>
        <TextDisplay class="fact-body" :text="body" />
    </div>
</template>

<style scoped>
.fact {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.fact-label {
    color: var(--text);
    font-size: 13px;
    font-weight: 600;
}

.fact-body {
    color: var(--text-2);
    font-size: 13px;
    line-height: 1.55;
}
</style>
