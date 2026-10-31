<script setup>
import {computed, reactive} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import TriggerCards from "./TriggerCards.vue";
import {blankTrigger, startWords, triggerBody, triggersProblem} from "../domain/sequenceTriggers.js";

const props = defineProps({resource: {type: Object, required: true}});
const draft = reactive({open: false, cards: [], error: "", busy: false});
const problem = computed(() => triggersProblem(draft.cards));
let made = 0;

function edit() {
    Object.assign(draft, {open: true, cards: (props.resource.triggers || []).map((t) => ({key: ++made, ...blankTrigger(t.trigger_type), ...t})), error: "", busy: false});
}

async function save() {
    if (problem.value) return;
    draft.busy = true;
    draft.error = "";
    try {
        await api.setTriggers(props.resource.id, draft.cards.map(triggerBody));
        draft.open = false;
    } catch (e) {
        draft.error = e.message;
    } finally {
        draft.busy = false;
    }
}
</script>

<template>
    <div class="sequence-triggers">
        <template v-if="!draft.open">
            <ul class="starts">
                <template v-for="line in startWords(resource)" :key="line">
                    <li>{{ line }}</li>
                </template>
            </ul>
            <template v-if="!resource.locked">
                <Btn small @click="edit">
                    <Icon name="pencil" :size="12" />
                    Edit triggers
                </Btn>
            </template>
        </template>
        <template v-else>
            <TriggerCards :cards="draft.cards" />
            <div class="editor-foot">
                <Btn kind="primary" small :busy="draft.busy" :disabled="!!problem" @click="save">Save triggers</Btn>
                <Btn small @click="draft.open = false">Cancel</Btn>
                <template v-if="draft.error || problem">
                    <span class="editor-note">{{ draft.error || problem }}</span>
                </template>
            </div>
        </template>
    </div>
</template>

<style scoped>
.sequence-triggers {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
}

.starts {
    margin: 0;
    padding: 0;
    list-style: none;
    color: var(--text-2);
    font-size: 13px;
    line-height: 1.6;
}

.editor-foot {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
}

.editor-note {
    color: var(--text-3);
    font-size: 12px;
}
</style>
