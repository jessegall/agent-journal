<script setup>
import Btn from "../kit/Btn.vue";

const props = defineProps({option: {type: Object, required: true}, values: {type: Object, default: () => ({})}});
const emit = defineEmits(["set"]);

const chosen = () => props.values[props.option.key] ?? props.option.default;
</script>

<template>
    <div class="pane-menu-choice" :data-option="option.key">
        <span>{{ option.label }}</span>
        <template v-for="[value, label] in option.choices" :key="value">
            <Btn :data-choice="value" :aria-pressed="chosen() === value" @click="emit('set', option.key, value)">{{ label }}</Btn>
        </template>
    </div>
</template>
