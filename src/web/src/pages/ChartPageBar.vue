<script setup>
import Btn from "../kit/Btn.vue";
import DropList from "../kit/DropList.vue";
import PageBar from "../kit/PageBar.vue";
import ChartEditControls from "./ChartEditControls.vue";

// the workflows page's bar: the runs, how it works, whose values show, and editing switched on or its controls
defineProps({
    busy: {type: String, default: ""},
    unlocked: {type: Boolean, required: true},
    current: {type: Number, required: true},
    valuesEnv: {type: String, required: true},
    environmentItems: {type: Array, required: true},
    eventTitle: {type: String, required: true},
    alsoWords: {type: String, required: true},
    unsaved: {type: Number, required: true},
    replaces: {type: String, required: true},
});
const emit = defineEmits(["runs", "lead", "env", "undo", "discard", "save", "done", "unlock"]);
</script>

<template>
    <PageBar class="chart-bar">
        <Btn kind="ghost" small :busy="busy === 'runs'" title="The last ten runs across every workflow" @click="emit('runs')">
            Recent runs
        </Btn>
        <Btn kind="ghost" small @click="emit('lead')">How it works</Btn>
        <template v-if="environmentItems.length > 1">
            <DropList
                :label="`Values in ${valuesEnv}`"
                :items="environmentItems"
                :picked="valuesEnv"
                :menu-width="220"
                title="The environment whose counts and times the canvas shows"
                @pick="emit('env', $event.key)"
            />
        </template>
        <span class="chart-grow" />
        <template v-if="unlocked">
            <ChartEditControls
                :event-title="eventTitle"
                :also-words="alsoWords"
                :unsaved="unsaved"
                :replaces="replaces"
                :saving="busy === 'save'"
                @undo="emit('undo')"
                @discard="emit('discard')"
                @save="emit('save')"
                @done="emit('done')"
            />
        </template>
        <template v-else>
            <Btn kind="ghost" small :disabled="!current" title="Change what the journal does here" @click="emit('unlock')">Edit</Btn>
        </template>
    </PageBar>
</template>

<style scoped>
.chart-grow {
    flex: 1;
}
</style>
