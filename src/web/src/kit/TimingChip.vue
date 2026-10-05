<script setup>
import {computed, ref} from "vue";
import {useOutside} from "../composables/outside.js";
import {COUNTED, EVENTS, EVENT_CHOICES, UNIT_CHOICES, same, timingEvery, timingMarks, timingUnit, timingWords} from "../domain/settingsCatalog.js";
import Btn from "./Btn.vue";
import Segmented from "./Segmented.vue";
import TextInput from "./TextInput.vue";

const props = defineProps({timing: {type: Object, required: true}, label: {type: String, default: ""}, sheet: Boolean});
const emit = defineEmits(["change"]);

const open = ref(false);
const chip = ref(null);
const when = computed(() => props.timing.value);
const units = computed(() => [...COUNTED, ...(when.value.unit === "notices" ? ["notices"] : [])].map((key) => ({key, label: UNIT_CHOICES[key]})));
const events = EVENTS.map((key) => ({key, label: EVENT_CHOICES[key]}));

useOutside(chip, () => !props.sheet && (open.value = false));

function pick(next) {
    if (next && !same(next, when.value)) emit("change", next);
}
</script>

<template>
    <span ref="chip" class="timing">
        <button type="button" :class="['timing-chip', {open}]" @click="open = !open">
            {{ timing.words }}
            <i class="timing-caret" />
        </button>
        <template v-if="open">
            <template v-if="sheet">
                <div class="timing-scrim" @click="open = false" />
            </template>
            <div :class="['timing-editor', {sheet}]" role="dialog" :aria-label="label">
                <template v-if="sheet">
                    <span class="timing-grab" />
                </template>
                <div class="timing-title">{{ label }}</div>
                <template v-if="when.at">
                    <div class="timing-line">
                        <span class="timing-word">At</span>
                        <TextInput class="timing-field marks" :value="when.at.join(', ')" @change="pick(timingMarks($event.target.value))" />
                        <span class="timing-word">% of context</span>
                    </div>
                </template>
                <template v-else>
                    <div class="timing-line">
                        <span class="timing-word">Every</span>
                        <TextInput class="timing-field" type="number" min="1" :value="when.every || ''" @change="pick(timingEvery(when, $event.target.value))" />
                        <Segmented :options="units" :value="when.unit || ''" :fill="sheet" @pick="pick(timingUnit(when, $event))" />
                    </div>
                </template>
                <div class="timing-line">
                    <span class="timing-word">Or once, when</span>
                    <Segmented :options="events" :value="when.on || ''" :fill="sheet" @pick="pick(timingUnit(when, $event))" />
                </div>
                <div class="timing-foot">
                    <span>Shipped: {{ timingWords(timing.shipped) }}</span>
                    <template v-if="timing.changed">
                        <button type="button" class="timing-reset" @click="pick(timing.shipped)">Reset</button>
                    </template>
                </div>
                <template v-if="sheet">
                    <Btn kind="primary" large fill @click="open = false">Done</Btn>
                </template>
            </div>
        </template>
    </span>
</template>

<style scoped>
.timing {
    position: relative;
    display: inline-flex;
}

.timing-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 24px;
    padding: 0 8px 0 9px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: var(--bg-2);
    color: var(--text-2);
    font: inherit;
    font-size: 12px;
    white-space: nowrap;
    cursor: pointer;
}

.timing-chip:hover,
.timing-chip.open {
    border-color: var(--accent);
    color: var(--text);
}

.timing-caret {
    width: 5px;
    height: 5px;
    margin-top: -3px;
    border-right: 1.4px solid var(--text-3);
    border-bottom: 1.4px solid var(--text-3);
    transform: rotate(45deg);
}

.timing-editor {
    position: absolute;
    top: 30px;
    right: 0;
    z-index: 20;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 410px;
    padding: 12px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--bg);
    box-shadow: var(--shadow);
    cursor: default;
}

.timing-editor.sheet {
    position: fixed;
    top: auto;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 60;
    gap: 14px;
    width: auto;
    padding: 10px 18px 34px;
    border-width: 1px 0 0;
    border-radius: 16px 16px 0 0;
}

.timing-scrim {
    position: fixed;
    inset: 0;
    z-index: 59;
    background: var(--scrim, rgba(0, 0, 0, 0.5));
}

.timing-grab {
    align-self: center;
    width: 36px;
    height: 4px;
    border-radius: 2px;
    background: var(--border-3);
}

.timing-title {
    color: var(--text-3);
    font-size: 11.5px;
}

.sheet .timing-title {
    color: var(--text);
    font-size: 16px;
    font-weight: 600;
}

.timing-line {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
}

.timing-word {
    color: var(--text-3);
    font-size: 12px;
}

.sheet .timing-word {
    font-size: 14px;
}

.timing-field {
    width: 62px;
}

.timing-field.marks {
    width: 120px;
}

.sheet .timing-field {
    width: 96px;
}

.timing-foot {
    display: flex;
    justify-content: space-between;
    color: var(--text-3);
    font-size: 11.5px;
}

.timing-editor.sheet :deep(.btn) {
    justify-content: center;
}

.timing-editor.sheet :deep(.btn-label) {
    flex: none;
}

.timing-reset {
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}
</style>
