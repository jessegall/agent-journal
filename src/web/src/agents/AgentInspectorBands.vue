<script setup>
import {clock} from "../format/time.js";
import {briefOpen} from "../composables/briefBand.js";
import Btn from "../kit/Btn.vue";
import Notice from "../kit/Notice.vue";
import OpenableText from "../kit/OpenableText.vue";

defineProps({
    confirm: {type: Object, default: null},
    brief: {type: Object, default: null},
    report: {type: Object, default: null},
    refusal: {type: String, default: ""},
    stateKey: {type: String, default: ""},
    plan: {type: Number, default: 0},
    resume: {type: Object, default: null},
});
const emit = defineEmits(["cancel", "confirmed", "show-plan", "resume"]);
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
        <template v-if="brief">
            <Notice tone="brief">
                <OpenableText label="Brief" title="Brief from the main agent" :text="brief.text" :shown="briefOpen" @close="briefOpen = false">
                    <template #more>
                        <small class="inspector-sent">Sent {{ clock(brief.at) }}</small>
                    </template>
                </OpenableText>
            </Notice>
        </template>
        <template v-if="report">
            <Notice tone="report">
                <OpenableText label="Report" title="Its report" :text="report.text">
                    <template #more>
                        <template v-if="report.href">
                            <Btn small :href="report.href">{{ report.label }}</Btn>
                        </template>
                    </template>
                </OpenableText>
            </Notice>
        </template>
        <template v-if="stateKey === 'waiting' && plan">
            <Notice tone="wait">
                Plan {{ plan }} needs your approval. The agent starts work once you approve it.
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

.inspector-sent {
    flex: none;
    color: var(--text-3);
    font-weight: 400;
}
</style>
