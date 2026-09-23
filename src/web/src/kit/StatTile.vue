<script setup>
defineProps({
    label: {type: String, required: true},
    value: {type: [String, Number], required: true},
    note: {type: String, default: ""},
    tone: {type: String, default: ""},
    opens: Boolean,
    flat: Boolean,
});
const emit = defineEmits(["open"]);
</script>

<template>
    <component
        :is="opens ? 'button' : 'div'"
        :type="opens ? 'button' : undefined"
        :class="['stat', tone, {opens, flat}]"
        @click="opens && emit('open')"
    >
        <span class="stat-value">{{ value }}</span>
        <span class="stat-label">{{ label }}</span>
        <template v-if="note">
            <span class="stat-note">{{ note }}</span>
        </template>
    </component>
</template>

<style scoped>
.stat {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
    min-width: 120px;
    padding: 12px 14px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--raised);
    color: var(--text);
    font: inherit;
    text-align: left;
}

.stat.flat {
    padding: 16px 20px 15px;
    border: 0;
    border-radius: 0;
}

.stat.opens {
    cursor: pointer;
}

.stat.opens:hover {
    border-color: var(--border-2);
    background: var(--hover);
}

.stat-value {
    font-size: 24px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
}

.stat.good .stat-value {
    color: var(--tone-good, var(--green));
}

.stat.progress .stat-value {
    color: var(--progress);
}

.stat.muted .stat-value {
    color: var(--text-4);
}

.stat.warn .stat-value {
    color: var(--tone-warn);
}

.stat.danger .stat-value {
    color: var(--tone-danger);
}

.stat-label {
    color: var(--text-2);
    font-size: 12.5px;
}

.stat-note {
    color: var(--text-3);
    font-size: 11.5px;
}
</style>
