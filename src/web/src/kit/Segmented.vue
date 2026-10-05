<script setup>
defineProps({options: {type: Array, required: true}, value: {type: String, default: ""}, fill: Boolean});
const emit = defineEmits(["pick"]);
</script>

<template>
    <span :class="['segmented', {fill}]" role="radiogroup">
        <template v-for="o in options" :key="o.key">
            <button
                type="button"
                role="radio"
                :aria-checked="o.key === value"
                :title="o.title"
                :class="['segmented-option', {on: o.key === value}]"
                @click="emit('pick', o.key)"
            >
                <template v-if="o.dot">
                    <span class="segmented-dot" />
                </template>
                {{ o.label }}
                <template v-if="o.count !== undefined">
                    <em class="segmented-count">{{ o.count }}</em>
                </template>
            </button>
        </template>
    </span>
</template>

<style scoped>
.segmented {
    display: inline-flex;
    gap: 2px;
    padding: 2px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
}

.segmented-option {
    padding: 3px 10px;
    border: 0;
    border-radius: 5px;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 12px;
    white-space: nowrap;
    cursor: pointer;
}

.segmented-option:hover {
    color: var(--text);
}

.segmented-dot {
    display: inline-block;
    width: 5px;
    height: 5px;
    margin-right: 5px;
    border-radius: 50%;
    background: var(--accent);
    vertical-align: middle;
}

.segmented-count {
    margin-left: 5px;
    color: var(--text-4);
    font-style: normal;
    font-variant-numeric: tabular-nums;
}

.segmented-option.on {
    background: var(--sel);
    color: var(--text);
}
.segmented.fill {
    display: flex;
    width: 100%;
    box-sizing: border-box;
}

.segmented.fill .segmented-option {
    flex: 1;
    min-height: 40px;
}
</style>
