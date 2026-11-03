<script setup>
import Btn from "../kit/Btn.vue";

const props = defineProps({option: {type: Object, required: true}, values: {type: Object, default: () => ({})}});
const emit = defineEmits(["set"]);

const isChosen = (preset) => Object.entries(preset.options).every(([key, shown]) => (props.values[key] ?? true) === shown);

function choose(preset) {
    Object.entries(preset.options).forEach(([key, shown]) => emit("set", key, shown));
}
</script>

<template>
    <div class="pane-menu-choice" :data-option="option.key">
        <span>{{ option.label }}</span>
        <template v-for="preset in option.presets" :key="preset.key">
            <Btn :data-choice="preset.key" :aria-pressed="isChosen(preset)" @click="choose(preset)">{{ preset.label }}</Btn>
        </template>
    </div>
</template>
