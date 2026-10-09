<script setup>
import {ref, watch} from "vue";
import {firstSentence} from "../format/sentence.js";
import Btn from "./Btn.vue";
import Dialog from "./Dialog.vue";
import TextDisplay from "./TextDisplay.vue";

const props = defineProps({
    label: {type: String, required: true},
    text: {type: String, default: ""},
    title: {type: String, default: ""},
    shown: {type: Boolean, default: false},
});
const emit = defineEmits(["close"]);
const open = ref(props.shown);
watch(() => props.shown, (shown) => shown && (open.value = true));
const close = () => {
    open.value = false;
    emit("close");
};
</script>

<template>
    <span class="openable">
        <strong class="openable-label">{{ label }}</strong>
        <TextDisplay class="openable-line" inline :text="firstSentence(text)" />
        <Btn small @click="open = true">Open</Btn>
        <slot name="more" />
    </span>
    <template v-if="open">
        <Dialog :title="title || label" large @close="close">
            <TextDisplay :text="text" />
        </Dialog>
    </template>
</template>

<style scoped>
.openable {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
}

.openable-label {
    flex: none;
}

.openable-line {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    color: var(--text-2);
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
