<script setup>
import {computed, inject, ref} from "vue";
import {phone} from "../api/phone.js";
import {spent} from "../domain/buttons.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import {announce, tell} from "./announce.js";
import {tick} from "./haptic.js";
import {ended} from "./outbox.js";

const props = defineProps({
    target: {type: String, required: true},
    buttons: {type: Array, required: true},
    large: {type: Boolean, default: false},
});
const emit = defineEmits(["pressed"]);
const failed = inject("phoneFailed");
const pressing = ref("");
const pressed = ref([]);
const failure = ref("");
const chosen = computed(() => pressed.value[pressed.value.length - 1] || "");
const live = computed(() => props.buttons.filter((b) => !spent({data: {buttons: props.buttons, pressed: pressed.value}}, b)));

async function press(button) {
    pressing.value = button.label;
    failure.value = "";
    try {
        await phone.press(props.target, button.label);
        pressed.value = [...pressed.value, button.label];
        announce(`You chose: ${button.label}`);
        tick();
        emit("pressed", button.label);
    } catch (error) {
        if (ended(error)) failed(error);
        else tell(failure, `That didn't go through: ${error.message}. Try again.`);
    } finally {
        pressing.value = "";
    }
}
</script>

<template>
    <template v-if="chosen">
        <p class="buttons-chosen">
            <Icon name="tick" :size="18" />
            You chose: {{ chosen }}
        </p>
    </template>
    <template v-if="failure">
        <p class="buttons-failure">{{ failure }}</p>
    </template>
    <template v-for="(button, i) in live" :key="button.label">
        <Btn
            :kind="i === 0 ? 'primary' : ''"
            :large="large"
            :busy="pressing === button.label"
            :disabled="Boolean(pressing)"
            @click="press(button)"
        >
            {{ button.label }}
        </Btn>
    </template>
</template>

<style scoped>
.buttons-chosen {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 50px;
    margin: 0;
    padding: 0 16px;
    border-radius: 12px;
    background: color-mix(in oklab, var(--tone-good) 16%, transparent);
    color: var(--text);
    font-weight: 600;
}

.buttons-chosen :deep(.ico) {
    color: var(--tone-good);
}

.buttons-failure {
    margin: 0;
    color: var(--text-2);
}
</style>
