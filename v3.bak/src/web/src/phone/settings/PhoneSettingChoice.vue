<script setup>
import Icon from "../../kit/Icon.vue";
import Cell from "../kit/Cell.vue";

defineProps({row: {type: Object, required: true}});
const emit = defineEmits(["change"]);
</script>

<template>
    <Cell :label="row.label" :sub="row.example ? `With this choice: ${row.example}` : row.hint" still />
    <template v-for="option in row.options" :key="option.key">
        <Cell :label="option.label" :chevron="false" @pick="emit('change', option.key)">
            <template #end>
                <template v-if="option.key === row.value">
                    <Icon name="check" :size="16" class="check" />
                </template>
            </template>
        </Cell>
    </template>
</template>

<style scoped>
.check {
    color: var(--accent-text);
}
</style>
