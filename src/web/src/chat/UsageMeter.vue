<script setup>
defineProps({
    label: {type: String, required: true},
    percent: {type: Number, default: 0},
    note: {type: String, default: ""},
});
</script>

<template>
    <div class="bar-usage">
        <span>{{ label }}</span>
        <strong>{{ Math.round(percent) }}%</strong>
        <span class="bar-usage-track"><span :style="{width: `${percent}%`}" /></span>
        <small>{{ note }}</small>
    </div>
</template>
