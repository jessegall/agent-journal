<script setup>
// one of a few choices; a size shows in thousands, a word shows with its first letter capitalised
const props = defineProps({modelValue: {type: [Number, String], default: ""}, choices: {type: Array, required: true}, disabled: {type: Boolean, default: false}});
const emit = defineEmits(["update:modelValue"]);

const choiceText = (choice) => (typeof choice === "number" ? `${choice / 1000}k` : `${choice.charAt(0).toUpperCase()}${choice.slice(1)}`);
const choose = (event) => emit("update:modelValue", props.choices.find((choice) => String(choice) === event.target.value));
</script>

<template>
    <select class="setting-choice" :value="String(modelValue)" :disabled="disabled" @change="choose">
        <template v-for="choice in choices" :key="choice">
            <option :value="String(choice)">{{ choiceText(choice) }}</option>
        </template>
    </select>
</template>

<style scoped>
.setting-choice { height: 28px; padding: 0 10px; border: 1px solid var(--border-2); border-radius: 7px; background: var(--bg); color: var(--text); font: inherit; font-size: 12px; }
.setting-choice:focus-visible { border-color: var(--accent); outline: 0; }
</style>
