<script setup>
import Button from "../kit/Button.vue";
import {resets, resettable} from "../../domain/settingsCatalog.js";

defineProps({row: {type: Object, required: true}});
const emit = defineEmits(["change", "timing"]);
</script>

<template>
    <template v-if="resettable(row)">
        <Button kind="link" @click="resets(row).forEach(([name, value]) => emit(name, value))">Back to the default</Button>
    </template>
</template>
