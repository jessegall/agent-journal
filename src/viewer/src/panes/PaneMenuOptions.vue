<script setup>
import Btn from "../kit/Btn.vue";

const props = defineProps({declared: {type: Array, required: true}, values: {type: Object, default: () => ({})}});
const emit = defineEmits(["set"]);

const isChosen = (preset) => Object.entries(preset.options).every(([key, shown]) => (props.values[key] ?? true) === shown);

function choose(preset) {
    Object.entries(preset.options).forEach(([key, shown]) => emit("set", key, shown));
}
</script>

<template>
    <template v-for="option in declared" :key="option.key">
        <template v-if="option.control === 'toggle'">
            <Btn :data-option="option.key" :aria-pressed="Boolean(values[option.key] ?? option.default)" @click="emit('set', option.key, !(values[option.key] ?? option.default))">
                {{ option.label }}
            </Btn>
        </template>
        <template v-else-if="option.control === 'preset'">
            <div class="pane-menu-choice" :data-option="option.key">
                <span>{{ option.label }}</span>
                <template v-for="preset in option.presets" :key="preset.key">
                    <Btn :data-choice="preset.key" :aria-pressed="isChosen(preset)" @click="choose(preset)">{{ preset.label }}</Btn>
                </template>
            </div>
        </template>
        <template v-else>
            <div class="pane-menu-choice" :data-option="option.key">
                <span>{{ option.label }}</span>
                <template v-for="[value, label] in option.choices" :key="value">
                    <Btn :data-choice="value" :aria-pressed="(values[option.key] ?? option.default) === value" @click="emit('set', option.key, value)">{{ label }}</Btn>
                </template>
            </div>
        </template>
    </template>
</template>
