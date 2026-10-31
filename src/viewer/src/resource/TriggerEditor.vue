<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {DOES, doesOf, sentence} from "../domain/triggerWords.js";
import ChoiceList from "../kit/ChoiceList.vue";
import FormField from "../kit/FormField.vue";
import TextArea from "../kit/TextArea.vue";
import ResourceBlock from "./ResourceBlock.vue";
import WatchedWords from "./WatchedWords.vue";

const props = defineProps({resource: {type: Object, default: null}, draft: {type: Object, default: null}});
const error = ref("");
const values = computed(() => props.draft || props.resource);
const does = computed(() => doesOf(values.value.action));
const pickable = (options, current) => options.map((option) => ({...option, current: option.value === current}));

async function commit(patch) {
    error.value = "";
    if (props.draft) return Object.assign(props.draft, patch);
    try {
        await api.change("triggers", props.resource.id, patch);
    } catch (e) {
        error.value = e.message;
    }
}
</script>

<template>
    <div class="trigger">
        <slot name="examples" />
        <div class="sum">
            <span class="sum-kind">What it does</span>
            <p class="sum-text">{{ sentence(values) }}</p>
        </div>
        <ResourceBlock heading="When these words appear">
            <WatchedWords :words="values.phrases || []" @words="(words) => commit({phrases: words})" />
        </ResourceBlock>
        <ResourceBlock heading="What happens next">
            <div class="then">
                <FormField label="What this trigger does">
                    <ChoiceList stacked :choices="pickable(DOES, values.action)" @pick="(action) => commit({action})" />
                </FormField>
                <FormField :label="does.ask">
                    <TextArea :value="values.text || ''" :placeholder="does.example" @change="commit({text: $event.target.value})" />
                </FormField>
            </div>
        </ResourceBlock>
        <template v-if="error">
            <p class="error">{{ error }}</p>
        </template>
    </div>
</template>

<style scoped>
.trigger {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: 12px;
}

.name {
    flex: none;
}

.name :deep(.inline-name-field) {
    padding: 4px 6px;
    border-color: transparent;
    background: none;
    font-size: 19px;
    font-weight: 600;
}

.name :deep(.inline-name-field:hover) {
    border-color: var(--border-2);
}

.name :deep(.inline-name-field:focus) {
    border-color: var(--accent);
    background: var(--bg-2);
}

.sum {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px 14px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--raised);
}

.sum-kind {
    color: var(--text-3);
    font-size: 11.5px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
}

.sum-text {
    margin: 0;
    color: var(--text);
    font-size: 14px;
    line-height: 1.55;
}

.sum-matched {
    color: var(--text-3);
    font-size: 12px;
}

.sum-text i {
    color: var(--text-3);
}

.then {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.help {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.error {
    margin: 0;
    color: var(--danger);
    font-size: 12px;
}
</style>
