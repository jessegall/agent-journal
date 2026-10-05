<script setup>
import {computed} from "vue";
import {
    COUNTED,
    EVENTS,
    EVENT_CHOICES,
    UNIT_CHOICES,
    same,
    timingEvery,
    timingMarks,
    timingUnit,
    timingWords,
} from "../domain/settingsCatalog.js";
import ResetButton from "./ResetButton.vue";
import Segmented from "./Segmented.vue";
import TextInput from "./TextInput.vue";

const props = defineProps({timing: {type: Object, required: true}, label: {type: String, default: ""}, sheet: Boolean});
const emit = defineEmits(["change"]);

const when = computed(() => props.timing.value);
const units = computed(() =>
    [...COUNTED, ...(when.value.unit === "notices" ? ["notices"] : [])].map((key) => ({key, label: UNIT_CHOICES[key]}))
);
const events = EVENTS.map((key) => ({key, label: EVENT_CHOICES[key]}));

function pick(next) {
    if (next && !same(next, when.value)) emit("change", next);
}
</script>

<template>
    <div class="timing-form">
        <div class="timing-title">{{ label }}: how often</div>
        <template v-if="when.at">
            <div class="timing-line">
                <span class="timing-word">At</span>
                <TextInput
                    class="timing-field marks"
                    :value="when.at.join(', ')"
                    aria-label="Percent of context"
                    @change="pick(timingMarks($event.target.value))"
                />
                <span class="timing-word">% of context</span>
            </div>
        </template>
        <template v-else>
            <div class="timing-line">
                <span class="timing-word">Every</span>
                <TextInput
                    class="timing-field"
                    type="number"
                    min="1"
                    :value="when.every || ''"
                    aria-label="How many"
                    @change="pick(timingEvery(when, $event.target.value))"
                />
            </div>
            <Segmented wrap :options="units" :value="when.unit || ''" @pick="pick(timingUnit(when, $event))" />
        </template>
        <div class="timing-line">
            <span class="timing-word">Or once, when</span>
            <Segmented wrap :options="events" :value="when.on || ''" @pick="pick(timingUnit(when, $event))" />
        </div>
        <div class="timing-foot">
            <span>Default: {{ timingWords(timing.shipped) }}. Saved as you change it.</span>
            <template v-if="timing.changed">
                <ResetButton @click="pick(timing.shipped)" />
            </template>
        </div>
    </div>
</template>

<style scoped>
.timing-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.timing-title {
    color: var(--text-3);
    font-size: 11.5px;
}

.timing-line {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
}

.timing-line :deep(.segmented) {
    flex: 1 1 100%;
}

.timing-word {
    color: var(--text-3);
    font-size: 12px;
}

.timing-field {
    width: 62px;
}

.timing-field.marks {
    width: 120px;
}

.timing-foot {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    color: var(--text-3);
    font-size: 11.5px;
}
</style>
