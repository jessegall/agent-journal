<script setup>
import {computed, ref} from "vue";
import ChatMark from "../kit/ChatMark.vue";
import MarkBody from "./MarkBody.vue";
import MarkButtons from "./MarkButtons.vue";
import {markDeclaration} from "../domain/markRegistry.js";
import {markLook} from "../domain/markLook.js";

const OUTPUT_MODELS = new Set(["output", "process"]);
const USER_SIDE_VARIANTS = new Set(["user"]);
const DOCK_LINE = "dock add";
const ANSWER_MARK = "questions.answer";

// one chat mark of any declared type, drawn by version 4's ChatMark from the type's declaration
const props = defineProps({mark: {type: Object, required: true}, allowedRuns: {type: Array, default: null}, docked: Boolean});
const declaration = computed(() => markDeclaration(props.mark.type));
const look = computed(() => markLook(props.mark, declaration.value));
// a mark with lines, an output or a body of its module's own, or one that names a row, opens in place on a click, and folds on the next; the
// row it names is opened by the small action link on the mark, never by the click on its line
const hasBody = computed(() => Boolean(props.mark.lines || look.value.detail || OUTPUT_MODELS.has(props.mark.target_model) || declaration.value?.body_url));
const opens = computed(() => hasBody.value || Boolean(look.value.handlers.onAct));
const isAnswer = computed(() => props.mark.type === ANSWER_MARK);
const opened = ref(false);
function clicked() {
    opened.value = !opened.value;
}
// a row in the dock has no Dock button left, and its mark steps back in opacity
const buttons = computed(() => (declaration.value?.buttons || []).filter((button) => !props.docked || !button.runs?.startsWith(DOCK_LINE))
    .map((button) => ({...button, module: declaration.value.module})));
</script>

<template>
    <template v-if="declaration?.card">
        <div :class="['thread-turn', 'card', 'whole-card', {'user-side': USER_SIDE_VARIANTS.has(mark.variant)}]" :data-ref="`chat_mark:${mark.id}`">
            <MarkBody :declaration="declaration" :mark="mark" shown />
        </div>
    </template>
    <template v-else>
        <div :class="['thread-turn', 'card', {'full-width': declaration?.full_width, docked, 'user-side': USER_SIDE_VARIANTS.has(mark.variant), 'answer-bubble': isAnswer}]" :data-ref="`chat_mark:${mark.id}`">
            <span class="mark-row">
                <ChatMark :mark="look" :open="opens ? opened : undefined" @act="look.handlers.onAct" @click="clicked">
                    <template v-if="hasBody" #default="{shown}">
                        <MarkBody :declaration="declaration || {}" :mark="mark" :shown="shown" />
                    </template>
                </ChatMark>
                <MarkButtons :buttons="buttons" :mark="mark" :allowed-runs="allowedRuns" />
            </span>
        </div>
    </template>
</template>

<style scoped>
.thread-turn {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    align-self: flex-start;
    --turn-gutter: 48px;

    gap: 3px;
    max-width: min(78%, calc(100% - var(--turn-gutter)));
}

/* a mark of what the user did sits on the user's side of the chat */
.thread-turn.user-side {
    align-items: flex-end;
    align-self: flex-end;
    margin-left: auto;
}

/* the answer to a question is the user's own turn, in a bubble of its own colour */
.thread-turn.answer-bubble {
    padding: 8px 12px;
    border-radius: 12px;
    background: color-mix(in srgb, var(--accent) 22%, var(--bg));
}

.thread-turn.answer-bubble :deep(*) {
    white-space: normal;
    color: var(--text);
}

/* a mark drawn as a card takes the chat's width and keeps to the card's own limit */
.thread-turn.whole-card {
    flex: 1;
    align-items: stretch;
    align-self: stretch;
    min-width: 0;
    max-width: none;
}

/* a card of what the user did keeps to the user's side as well, at the width it has on the other side */
.thread-turn.whole-card.user-side {
    align-items: flex-end;
    align-self: stretch;
    margin-left: 0;
}

.thread-turn.whole-card.user-side > :deep(*) {
    width: 100%;
}

.mark-row {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    max-width: 100%;
}

:global(html.phone .mark-row) {
    gap: 4px;
}

/* a line across the whole chat, as the compaction is: what is above it was summed up */
.thread-turn.full-width {
    flex: 1;
    flex-direction: row;
    align-items: center;
    align-self: stretch;
    gap: 10px;
    max-width: none;
    margin: 4px 0;
}

.thread-turn.full-width::before,
.thread-turn.full-width::after {
    content: "";
    flex: 1;
    height: 1px;
    background: var(--border-2);
}

.thread-turn.card.docked {
    opacity: 0.55;
}

/* an opened mark grows to the chat's whole width, past the share a folded line keeps; while it moves the mark itself holds its width, so the row around it never animates apart from it */
.thread-turn.card:has(.mark[data-open]:not(.leaving, .resizing)) {
    width: calc(100% - var(--turn-gutter));
    max-width: calc(100% - var(--turn-gutter));
}

.thread-turn.card:has(.mark.leaving, .mark.resizing) {
    max-width: calc(100% - var(--turn-gutter));
}

.thread-turn.card:has(.mark[data-open]:not(.leaving, .resizing)) .mark-row,
.thread-turn.card:has(.mark[data-open]:not(.leaving, .resizing)) .mark-row > :deep(.mark) {
    flex: 1;
    width: 100%;
    min-width: 0;
}
</style>
