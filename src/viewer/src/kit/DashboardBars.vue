<script setup>
import BarList from "./BarList.vue";

defineProps({node: {type: Object, required: true}});
const emit = defineEmits(["open"]);
</script>

<template>
    <div class="bars">
        <template v-if="node.title">
            <span class="bars-title">{{ node.title }}</span>
        </template>
        <BarList :items="node.items" :unit="node.unit || ''" @open="emit('open', $event)" />
    </div>
</template>

<style scoped>
.bars {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.bars-title {
    color: var(--text);
    font-size: 13.5px;
    font-weight: 600;
}
</style>
