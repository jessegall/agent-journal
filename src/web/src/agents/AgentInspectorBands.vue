<script setup>
import {ref} from "vue";
import Btn from "../kit/Btn.vue";
import Notice from "../kit/Notice.vue";
import TextDisplay from "../kit/TextDisplay.vue";

defineProps({
    confirm: {type: Object, default: null},
    report: {type: Object, default: null},
    refusal: {type: String, default: ""},
    stateKey: {type: String, default: ""},
    plan: {type: Number, default: 0},
    resume: {type: Object, default: null},
});
const emit = defineEmits(["cancel", "confirmed", "show-plan", "resume"]);
const reportOpen = ref(false);
</script>

<template>
    <div class="inspector-bands">
        <template v-if="confirm">
            <Notice tone="danger">
                {{ confirm.text }}
                <template #actions>
                    <Btn small @click="emit('cancel')">{{ confirm.cancel }}</Btn>
                    <Btn small kind="danger" @click="emit('confirmed')">{{ confirm.button }}</Btn>
                </template>
            </Notice>
        </template>
        <template v-if="refusal">
            <Notice tone="danger">{{ refusal }}</Notice>
        </template>
        <template v-if="report">
            <Notice tone="report">
                <strong>Its report</strong>
                <TextDisplay :class="['inspector-report', {whole: reportOpen}]" :text="report.text" />
                <template #actions>
                    <Btn small @click="reportOpen = !reportOpen">{{ reportOpen ? "Show less" : "Show the whole report" }}</Btn>
                    <template v-if="report.href">
                        <Btn small :href="report.href">{{ report.label }}</Btn>
                    </template>
                </template>
            </Notice>
        </template>
        <template v-if="stateKey === 'waiting' && plan">
            <Notice tone="wait">
                Plan {{ plan }} waits for your approval. The agent starts work once you approve it.
                <template #actions>
                    <Btn small @click="emit('show-plan')">Show the plan</Btn>
                </template>
            </Notice>
        </template>
        <template v-if="stateKey === 'paused'">
            <Notice tone="wait">
                Paused. It finishes the step it is on, then waits until you resume it.
                <template v-if="resume" #actions>
                    <Btn small @click="emit('resume')">{{ resume.label }}</Btn>
                </template>
            </Notice>
        </template>
        <template v-if="stateKey === 'stopped'">
            <Notice tone="info">Its agent is stopped. Its chat, files and history stay here to read.</Notice>
        </template>
    </div>
</template>

<style scoped>
.inspector-bands {
    display: flex;
    flex: none;
    flex-direction: column;
    gap: 8px;
    padding: 8px 16px;
}

.inspector-bands:empty {
    display: none;
}

.inspector-report {
    margin-top: 4px;
    max-height: 5.4em;
    overflow: hidden;
    color: var(--text-2);
    font-weight: 400;
}

.inspector-report.whole {
    max-height: 40vh;
    overflow-y: auto;
}
</style>
