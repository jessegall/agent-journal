<script setup>
import SidePanel from "../kit/SidePanel.vue";

defineProps({
    title: {type: String, required: true},
    kind: {type: String, required: true},
    main: {type: Object, default: null},
    rest: {type: Array, required: true},
});
const emit = defineEmits(["close"]);
</script>

<template>
    <SidePanel :title="title" :abstract="kind" @close="emit('close')">
        <template v-if="main">
            <dl class="chart-details">
                <dt>{{ main.label }}</dt>
                <dd>{{ main.words }}</dd>
            </dl>
        </template>
        <template v-if="rest.length">
            <details class="chart-details-more">
                <summary>More about this step</summary>
                <dl class="chart-details">
                    <template v-for="line in rest" :key="line.label">
                        <dt>{{ line.label }}</dt>
                        <dd>{{ line.words }}</dd>
                    </template>
                </dl>
            </details>
        </template>
    </SidePanel>
</template>

<style scoped>
.chart-details {
    display: grid;
    grid-template-columns: 1fr;
    margin: 0;
    font-size: 13px;
}

.chart-details dt {
    color: var(--text-3);
    font-size: 12px;
    margin-bottom: 2px;
}

.chart-details dd {
    margin: 0 0 12px;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

.chart-details-more {
    margin-top: 12px;
}

.chart-details-more > summary {
    color: var(--text-2);
    font-size: 12.5px;
    cursor: pointer;
}
</style>
