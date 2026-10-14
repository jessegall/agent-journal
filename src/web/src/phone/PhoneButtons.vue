<script setup>
import {computed, inject, ref} from "vue";
import {phone} from "../api/phone.js";
import {allButtons, pressedLabels, unpressed} from "../domain/buttons.js";
import {usePressing} from "../composables/pressing.js";
import Btn from "../kit/Btn.vue";
import Notice from "../kit/Notice.vue";
import {announce, tryAgain} from "./announce.js";
import {tick} from "./haptic.js";
import {ended} from "./outbox.js";

const props = defineProps({
    row: {type: Object, required: true},
    large: {type: Boolean, default: false},
});
const emit = defineEmits(["pressed"]);
const failed = inject("phoneFailed");
const {pressing, failure, run} = usePressing({
    failed: (error) => {
        if (ended(error)) return failed(error);
        announce(tryAgain(error));
        return tryAgain(error);
    },
});
const local = ref([]);
const pressed = computed(() => [...new Set([...pressedLabels(props.row), ...local.value])]);
const chosen = computed(() => local.value[local.value.length - 1] || pressed.value[pressed.value.length - 1] || "");
const live = computed(() => unpressed(allButtons(props.row), pressed.value));

function press(button) {
    return run(button.label, async () => {
        await phone.press(`${props.row.type}:${props.row.n}`, button.label);
        local.value = [...local.value, button.label];
        announce(`You chose: ${button.label}`);
        tick();
        emit("pressed", button.label);
    });
}
</script>

<template>
    <template v-if="chosen">
        <Notice tone="good" icon="tick">You chose: {{ chosen }}</Notice>
    </template>
    <template v-if="failure">
        <Notice>{{ failure }}</Notice>
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
