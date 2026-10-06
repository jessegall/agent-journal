<script setup>
import {computed, inject, nextTick, onMounted, onUnmounted, ref} from "vue";
import Icon from "../kit/Icon.vue";
import PhoneSheet from "./PhoneSheet.vue";
import SuggestionCard from "../chat/SuggestionCard.vue";
import {CLOSE_NOTE, hoursText, isOpen, phaseOf} from "../domain/suggestions.js";

const SEEN_MS = 2000;
const MARKED = "suggestion";
const props = defineProps({suggestion: {type: Object, required: true}, hours: {type: Number, required: true}});
const emit = defineEmits(["close"]);
const acts = inject("suggestionActs");
const sheet = ref(null);
const title = ref(null);
const open = computed(() => isOpen(phaseOf(props.suggestion)));
let noted = false;
let timer = 0;

function note() {
    if (noted) return;
    noted = true;
    clearTimeout(timer);
    acts.noteWindow(props.suggestion.n).catch(() => (noted = false));
}

function gone() {
    note();
    if (history.state?.sheet === MARKED) history.back();
    emit("close");
}

const backed = (event) => event.state?.sheet !== MARKED && sheet.value?.close();

onMounted(() => {
    history.pushState({...history.state, sheet: MARKED}, "");
    window.addEventListener("popstate", backed);
    timer = setTimeout(note, SEEN_MS);
    nextTick(() => title.value?.focus({preventScroll: true}));
});

onUnmounted(() => {
    window.removeEventListener("popstate", backed);
    clearTimeout(timer);
});
</script>

<template>
    <PhoneSheet ref="sheet" :label="suggestion.title" held @close="gone">
        <template #default="{close}">
            <div class="suggestion-sheet">
                <div class="suggestion-sheet-head">
                    <h3 ref="title" class="suggestion-sheet-title" tabindex="-1">{{ suggestion.title }}</h3>
                    <button type="button" class="suggestion-sheet-close" @click="close">Close</button>
                </div>
                <p class="suggestion-sheet-meta">
                    <Icon name="bulb" />
                    <span>
                        Suggestion {{ suggestion.n }} · unanswered for
                        <span class="from-setting" title="From Settings › Suggestions">{{ hoursText(hours) }}</span>
                    </span>
                </p>
                <template v-if="open">
                    <p class="suggestion-sheet-note">{{ CLOSE_NOTE }}</p>
                </template>
                <SuggestionCard :suggestion="suggestion" bare phone @acted="note" />
            </div>
        </template>
    </PhoneSheet>
</template>

<style scoped>
.suggestion-sheet {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 0 16px 16px;
}

.suggestion-sheet-head {
    display: flex;
    align-items: flex-start;
    gap: 8px;
}

.suggestion-sheet-title {
    flex: 1;
    margin: 10px 0 0;
    font-size: 1.06em;
    font-weight: 600;
    line-height: 1.3;
    outline: none;
}

.suggestion-sheet-close {
    min-width: 44px;
    min-height: 44px;
    padding: 0 6px;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
}

.suggestion-sheet-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0;
    color: var(--text-3);
    font-size: 0.765em;
}

.suggestion-sheet-meta :deep(svg) {
    color: var(--blocking);
}

.from-setting {
    border-bottom: 1px dotted var(--text-3);
}

.suggestion-sheet-note {
    margin: 0;
    color: var(--text-2);
    font-size: 0.765em;
}
</style>
