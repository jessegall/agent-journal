<script setup>
import {computed, ref} from "vue";
import {Btn, Icon, Segmented, useWindow} from "@journal/window-kit";
import {blankTrigger, typeOf, startWords, triggerBody, triggersProblem, TRIGGER_TYPES} from "./sequenceTriggers.js";

// what starts a sequence on its own, read as sentences and edited as cards
const props = defineProps({sequence: {type: Object, required: true}});
const context = useWindow();
const TYPE_OPTIONS = TRIGGER_TYPES.map((type) => ({key: type.value, label: type.label}));
const triggers = computed(() => JSON.parse(props.sequence.triggers || "[]"));
const words = computed(() => startWords(triggers.value));
const draft = ref(null);
const refusal = ref("");
const problem = computed(() => (draft.value ? triggersProblem(draft.value) : ""));

const edit = () => (draft.value = triggers.value.map((trigger) => ({...blankTrigger(), ...trigger})));

async function save() {
    const answer = await context.run(["sequence", "edit", String(props.sequence.id), "--triggers", JSON.stringify(draft.value.map(triggerBody))]);
    refusal.value = answer.ok ? "" : answer.error;
    if (answer.ok) draft.value = null;
}
</script>

<template>
    <section class="sequence-triggers" data-sequence-triggers>
        <header class="head">
            <span class="title">Starts</span>
            <template v-if="!draft">
                <Btn small data-sequence-triggers-edit @click="edit"><Icon name="pencil" :size="12" /> Edit</Btn>
            </template>
        </header>
        <template v-if="!draft">
            <template v-for="line in words" :key="line">
                <p class="line" data-sequence-trigger>{{ line }}</p>
            </template>
        </template>
        <template v-else>
            <template v-for="(trigger, index) in draft" :key="index">
                <div class="card" data-sequence-trigger-card>
                    <Segmented :options="TYPE_OPTIONS" :value="trigger.trigger_type" @pick="trigger.trigger_type = $event" />
                    <template v-for="field in typeOf(trigger.trigger_type).fields" :key="field.name">
                        <label class="label">{{ field.label }}</label>
                        <input v-model="trigger[field.name]" :placeholder="field.placeholder" :aria-label="field.label" :data-trigger-field="field.name">
                    </template>
                    <Btn small data-sequence-trigger-remove @click="draft.splice(index, 1)">Remove</Btn>
                </div>
            </template>
            <div class="foot">
                <Btn small data-sequence-trigger-add @click="draft.push(blankTrigger())">Add a trigger</Btn>
                <Btn small variant="primary" :disabled="Boolean(problem)" data-sequence-triggers-save @click="save">Save</Btn>
                <Btn small @click="draft = null">Cancel</Btn>
                <span class="note" role="status">{{ refusal || problem }}</span>
            </div>
        </template>
    </section>
</template>

<style scoped>
.sequence-triggers {
    margin-bottom: 14px;
}

.head {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 6px;
}

.title,
.label,
.note {
    color: var(--text-3);
    font-size: 12px;
}

.line {
    margin: 0 0 2px;
    font-size: 13px;
}

.card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    margin-bottom: 8px;
    padding: 10px;
    border: 1px solid var(--border);
    border-radius: 8px;
}

.card input {
    width: 100%;
    padding: 4px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--surface);
    color: inherit;
    font-size: 13px;
}

.foot {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
}
</style>
