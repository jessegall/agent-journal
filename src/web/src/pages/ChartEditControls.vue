<script setup>
import Btn from "../kit/Btn.vue";

defineProps({
    eventTitle: {type: String, required: true},
    alsoWords: {type: String, required: true},
    unsaved: {type: Number, required: true},
    replaces: {type: String, default: ""},
    saving: {type: Boolean, default: false},
});
const emit = defineEmits(["undo", "discard", "save", "done"]);
</script>

<template>
    <span class="chart-warning">Saving changes this for every agent, from the next {{ eventTitle }}. {{ alsoWords }}</span>
    <template v-if="replaces">
        <span class="chart-unsaved">Save replaces {{ replaces }}'s version</span>
    </template>
    <template v-else-if="unsaved">
        <span class="chart-unsaved">{{ unsaved }} unsaved {{ unsaved === 1 ? "change" : "changes" }}</span>
    </template>
    <Btn kind="ghost" small :disabled="!unsaved" title="Undo last change" @click="emit('undo')">Undo</Btn>
    <Btn kind="ghost" small :disabled="!unsaved" @click="emit('discard')">Discard changes</Btn>
    <Btn
        kind="primary"
        small
        :busy="saving"
        :disabled="!unsaved && !replaces"
        title="Takes effect at the agent's next event"
        @click="emit('save')"
    >
        Save
    </Btn>
    <Btn kind="ghost" small @click="emit('done')">Done</Btn>
</template>

<style scoped>
.chart-unsaved {
    color: var(--text-3);
    font-size: 12px;
}

.chart-warning {
    color: var(--warn);
    font-size: 12px;
}
</style>
