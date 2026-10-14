<script setup>
import Spinner from "../kit/Spinner.vue";

defineProps({busy: {type: Boolean, default: false}, failed: {type: Boolean, default: false}, beginning: {type: Boolean, default: false}});
const emit = defineEmits(["retry"]);
</script>

<template>
    <div class="home-older">
        <template v-if="busy">
            <Spinner />
        </template>
        <template v-else-if="failed">
            <span>Couldn't load earlier messages.</span>
            <button type="button" class="home-retry" @click="emit('retry')">Try again</button>
        </template>
        <template v-else-if="beginning">
            <span>Start of the conversation</span>
        </template>
    </div>
</template>

<style scoped>
.home-older {
    display: flex;
    flex: none;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    min-height: 36px;
    color: var(--text-3);
    font-size: 0.765rem;
}

.home-retry {
    min-height: 32px;
    margin-left: 8px;
    padding: 0 12px;
    border: 0;
    border-radius: 16px;
    background: color-mix(in oklab, var(--accent) 14%, transparent);
    color: var(--accent-text);
    font: inherit;
    font-weight: 600;
}
</style>
