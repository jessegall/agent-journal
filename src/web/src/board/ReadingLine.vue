<script setup>
import {computed} from "vue";

const props = defineProps({summary: {type: Object, required: true}});
const summaryKey = computed(() => `${props.summary.text}|${props.summary.step}`);
</script>

<template>
    <Transition name="layer">
        <div :key="summaryKey" class="reading" :title="summary.text">
            <template v-if="summary.text">
                <span class="reading-text">{{ summary.text }}</span>
            </template>
            <template v-else>
                <span class="reading-text quiet">I'll say here what I think you mean.</span>
            </template>
            <span class="reading-step">{{ summary.step }}</span>
        </div>
    </Transition>
</template>

<style scoped>
.reading {
    position: absolute;
    inset: 0 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
}

.reading-text {
    overflow: hidden;
    color: var(--text);
    font-size: 13px;
    line-height: 18px;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.reading-text.quiet {
    color: var(--text-4);
}

.reading-step {
    color: var(--text-3);
    font-size: 11.5px;
    line-height: 16px;
}
</style>
