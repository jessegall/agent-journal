<script setup>
defineProps({
    faults: {type: Array, required: true},
    wordsOf: {type: Function, required: true},
});
const emit = defineEmits(["select"]);
</script>

<template>
    <ul class="chart-faults" role="alert">
        <template v-for="fault in faults" :key="`${fault.node}:${wordsOf(fault)}`">
            <li>
                <button type="button" class="chart-fault" :disabled="!fault.node" @click="emit('select', fault.node)">
                    {{ wordsOf(fault) }}
                </button>
            </li>
        </template>
    </ul>
</template>

<style scoped>
.chart-faults {
    margin: 0;
    padding: 6px 16px;
    border-bottom: 1px solid var(--line);
    background: color-mix(in oklab, var(--danger) 8%, var(--bg));
    list-style: none;
}

.chart-fault {
    padding: 2px 0;
    border: 0;
    background: none;
    color: var(--danger-soft);
    font: inherit;
    font-size: 12.5px;
    text-align: left;
    cursor: pointer;
}

.chart-fault:disabled {
    cursor: default;
}
</style>
