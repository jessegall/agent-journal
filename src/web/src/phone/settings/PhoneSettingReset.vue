<script setup>
import {resets, resettable} from "../../domain/settingsCatalog.js";

defineProps({row: {type: Object, required: true}});
const emit = defineEmits(["change", "timing"]);
</script>

<template>
    <template v-if="resettable(row)">
        <button type="button" class="reset" @click="resets(row).forEach(([name, value]) => emit(name, value))">Back to the default</button>
    </template>
</template>

<style scoped>
.reset {
    min-height: 44px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-size: 0.875rem;
}
</style>
