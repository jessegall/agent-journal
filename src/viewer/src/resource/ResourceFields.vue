<script setup>
import TimeAgo from "../../kit/TimeAgo.vue";
defineProps({fields: {type: Array, required: true}});
const emit = defineEmits(["peek"]);
</script>

<template>
<section class="section field-grid" data-resource-fields>
    <template v-for="field in fields" :key="field.name">
        <p class="field-name">{{ field.label }}</p>
        <template v-if="field.isTime">
            <TimeAgo class="field-value" :at="field.value" />
        </template>
        <template v-else-if="field.link">
            <p class="field-value"><button type="button" class="field-link" data-resource-link @click="emit('peek', field.link)">{{ field.value }}</button></p>
        </template>
        <template v-else>
            <p class="field-value">{{ field.value }}</p>
        </template>
    </template>
</section>
</template>

<style scoped>
.section { margin-top: 20px; }
.field-grid {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 6px 16px;
    align-items: baseline;
}

.field-name {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.field-value {
    margin: 0;
    font-size: 13px;
    overflow-wrap: anywhere;
}

.field-link {
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.field-link:hover {
    color: var(--text);
}

</style>
