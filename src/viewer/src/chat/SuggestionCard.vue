<script setup>
import {ref} from "vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import {api} from "../api/client.js";
import {suggestionOutcome} from "../domain/suggestions.js";

const props = defineProps({suggestion: {type: Object, required: true}});
const busy = ref("");
const failed = ref("");

async function answer(act) {
    busy.value = act;
    failed.value = "";
    try {
        const got = await api.act("suggestions", props.suggestion.id, act);
        if (got.go) location.hash = `#/${got.go}`;
    } catch (e) {
        failed.value = e.message;
    }
    busy.value = "";
}
</script>

<template>
    <div class="suggestion-card">
        <span class="suggestion-kind">
            <Icon name="bulb" />
            Suggestion
        </span>
        <span class="suggestion-title">{{ suggestion.title }}</span>
        <TextDisplay class="suggestion-detail" :text="suggestion.detail" />
        <template v-if="suggestion.answer">
            <span class="suggestion-outcome">{{ suggestionOutcome(suggestion.answer) }}</span>
        </template>
        <template v-else>
            <div class="suggestion-acts">
                <Btn kind="primary" small :busy="busy === 'accept'" :disabled="!!busy" @click="answer('accept')">{{ suggestion.accept }}</Btn>
                <Btn small :busy="busy === 'decline'" :disabled="!!busy" @click="answer('decline')">No, and don't suggest it again</Btn>
            </div>
        </template>
        <template v-if="failed">
            <span class="suggestion-failed">{{ failed }}</span>
        </template>
    </div>
</template>

<style scoped>
.suggestion-card {
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-width: 560px;
    padding: 11px 14px 12px;
    border: 1px solid var(--border-2);
    border-radius: 12px;
    background: var(--bg);
}

.suggestion-kind {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--text-3);
    font-size: 11px;
}

.suggestion-title {
    margin-top: 4px;
    font-weight: 500;
}

.suggestion-detail {
    color: var(--text-2);
    font-size: 12.5px;
}

.suggestion-acts {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 6px;
}

.suggestion-outcome {
    color: var(--text-3);
    font-size: 12px;
}

.suggestion-failed {
    color: var(--danger);
    font-size: 12px;
}
</style>
