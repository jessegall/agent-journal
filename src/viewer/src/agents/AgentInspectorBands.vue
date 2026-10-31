<script setup>
import {ref} from "vue";
import {clock} from "../format/time.js";
import {briefOpen} from "../composables/briefBand.js";
import Btn from "../kit/Btn.vue";
import Notice from "../kit/Notice.vue";
import OpenableText from "../kit/OpenableText.vue";
import SequenceBand from "./SequenceBand.vue";
import TextArea from "../kit/TextArea.vue";

defineProps({
    confirm: {type: Object, default: null},
    brief: {type: Object, default: null},
    report: {type: Object, default: null},
    refusal: {type: String, default: ""},
    stateKey: {type: String, default: ""},
    plan: {type: Number, default: 0},
    resume: {type: Object, default: null},
    sequence: {type: Object, default: null},
    sequenceHistory: {type: Array, default: () => []},
    sequenceBusy: {type: String, default: ""},
});
const emit = defineEmits(["cancel", "confirmed", "show-plan", "resume", "skip-step", "end-sequence"]);
const answer = ref("");
</script>

<template>
    <div class="inspector-bands">
        <template v-if="confirm">
            <Notice :tone="confirm.input ? 'ask' : 'danger'">
                {{ confirm.text }}
                <template v-if="confirm.input">
                    <TextArea class="confirm-input" :placeholder="confirm.input" @input="answer = $event.target.value" />
                </template>
                <template #actions>
                    <Btn small @click="emit('cancel')">{{ confirm.cancel }}</Btn>
                    <Btn small :kind="confirm.input ? 'primary' : 'danger'" :disabled="Boolean(confirm.input) && !answer.trim()" @click="emit('confirmed', answer.trim())">
                        {{ confirm.button }}
                    </Btn>
                </template>
            </Notice>
        </template>
        <template v-if="refusal">
            <Notice tone="danger">{{ refusal }}</Notice>
        </template>
        <template v-if="brief">
            <Notice tone="brief">
                <OpenableText
                    label="Brief"
                    title="Brief from the main agent"
                    :text="brief.text"
                    :shown="briefOpen"
                    @close="briefOpen = false"
                >
                    <template #more>
                        <small class="inspector-sent">Sent {{ clock(brief.time) }}</small>
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
        <template v-if="sequence">
            <SequenceBand
                :sequence="sequence"
                :history="sequenceHistory"
                :busy="sequenceBusy"
                @skip="emit('skip-step')"
                @end="emit('end-sequence')"
            />
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
.confirm-input {
    min-height: 72px;
    margin-top: 8px;
}

.inspector-bands {
    display: flex;
    flex: none;
    flex-direction: column;
}

.inspector-bands > :deep(.notice) {
    margin: 8px 16px;
}

.inspector-bands > :deep(.notice-brief),
.inspector-bands > :deep(.notice-report) {
    margin: 0;
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
