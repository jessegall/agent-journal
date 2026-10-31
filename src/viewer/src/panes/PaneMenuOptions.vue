<script setup>
import Btn from "../kit/Btn.vue";

defineProps({declared: {type: Array, required: true}, values: {type: Object, default: () => ({})}});
const emit = defineEmits(["set"]);
</script>

<template>
    <template v-for="option in declared" :key="option.key">
        <template v-if="option.control === 'toggle'">
            <Btn :data-option="option.key" :aria-pressed="Boolean(values[option.key] ?? option.default)" @click="emit('set', option.key, !(values[option.key] ?? option.default))">
                {{ option.label }}
            </Btn>
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
