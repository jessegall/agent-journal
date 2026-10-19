<script setup>
import {stayOn} from "../domain/workflowLocks.js";
import Btn from "../kit/Btn.vue";

defineProps({
    workflow: {type: Object, required: true},
    canTry: {type: Boolean, required: true},
    shipped: {type: Boolean, required: true},
    busy: {type: String, required: true},
});
const emit = defineEmits(["test", "turn-on", "confirm"]);
</script>

<template>
    <template v-if="canTry">
        <Btn
            kind="ghost"
            small
            :busy="busy === 'try'"
            title="Runs the saved workflow against what is on record now; nothing is sent to the agent"
            @click="emit('test')"
        >
            Test run
        </Btn>
    </template>
    <template v-if="workflow.off">
        <Btn kind="ghost" small :busy="busy === 'on'" @click="emit('turn-on')">Turn on</Btn>
    </template>
    <template v-else>
        <Btn kind="ghost" small :disabled="Boolean(stayOn(workflow))" :title="stayOn(workflow) || null" @click="emit('confirm', 'off')">
            Turn off
        </Btn>
    </template>
    <template v-if="shipped && (workflow.edited || workflow.off)">
        <Btn kind="ghost" small @click="emit('confirm', 'reset')">Reset to default</Btn>
    </template>
    <template v-if="!shipped && !workflow.locked">
        <Btn kind="ghost" small @click="emit('confirm', 'remove')">Delete</Btn>
    </template>
</template>
