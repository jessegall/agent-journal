<script setup>
import {computed, inject, ref} from "vue";
import ChatMark from "../kit/ChatMark.vue";
import MarkBody from "./MarkBody.vue";
import MarkButtons from "./MarkButtons.vue";
import {markDeclaration} from "../domain/markRegistry.js";
import {usePoll} from "../../kit/usePoll.js";
import {WINDOW_CONTEXT} from "../windows/windowContext.js";
import {markLook, STOPPED_VARIANTS} from "../domain/markLook.js";

const OUTPUT_MODELS = new Set(["output", "process"]);
const USER_SIDE_VARIANTS = new Set(["user"]);
const DOCK_LINE = "dock add";

// one chat mark of any declared type, drawn by version 4's ChatMark from the type's declaration
const props = defineProps({mark: {type: Object, required: true}, allowedRuns: {type: Array, default: null}, docked: Boolean});
const declaration = computed(() => markDeclaration(props.mark.type));
// a running run's mark reads its output row every two seconds, which the journal's clock keeps current
const context = inject(WINDOW_CONTEXT, null);
const isRunningRun = computed(() => Boolean(context && props.mark.target_model === "process" && props.mark.target_id && !props.mark.ended_at));
const livePercent = ref(null);
usePoll(async () => {
    if (!isRunningRun.value) return;
    const answer = await context.read(["output", "list", "--process", String(props.mark.target_id)]);
    if (answer.ok && answer.value.rows.length) livePercent.value = answer.value.rows[0].progress;
}, () => isRunningRun.value);
const look = computed(() => {
    const drawn = markLook(props.mark, declaration.value);
    const showsPercent = !drawn.figure || drawn.figure.endsWith("%");
    return livePercent.value && isRunningRun.value && showsPercent ? {...drawn, figure: `${livePercent.value}%`, fraction: livePercent.value / 100} : drawn;
});
// a mark with lines, an output or a body of its module's own opens in place on a click, and folds on the next; its row's action stays its own
const opens = computed(() => Boolean(props.mark.lines || (props.mark.detail && STOPPED_VARIANTS.has(props.mark.variant)) || OUTPUT_MODELS.has(props.mark.target_model) || declaration.value?.body_url));
const opened = ref(false);
// a row in the dock has no Dock button left, and its mark steps back in opacity
const buttons = computed(() => (props.docked ? declaration.value?.buttons?.filter((button) => !button.runs?.startsWith(DOCK_LINE)) : declaration.value?.buttons));
</script>

<template>
    <template v-if="declaration?.card">
        <div class="thread-turn card whole-card" :data-ref="`chat_mark:${mark.id}`">
            <MarkBody :declaration="declaration" :mark="mark" shown />
        </div>
    </template>
    <template v-else>
        <div :class="['thread-turn', 'card', {'full-width': declaration?.full_width, docked, 'user-side': USER_SIDE_VARIANTS.has(mark.variant)}]" :data-ref="`chat_mark:${mark.id}`">
            <span class="mark-row">
                <ChatMark :mark="look" :open="opens ? opened : undefined" v-on="look.handlers" @click="opened = !opened">
                    <template v-if="opens" #default="{shown}">
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
}

/* a mark drawn as a card takes the chat's width and keeps to the card's own limit */
.thread-turn.whole-card {
    flex: 1;
    align-items: stretch;
    align-self: stretch;
    min-width: 0;
    max-width: none;
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

/* an opened mark grows to the chat's whole width, past the share a folded line keeps */
.thread-turn.card {
    interpolate-size: allow-keywords;
    transition: width 0.2s ease;
}

.thread-turn.card:has(.mark[data-open]) {
    width: calc(100% - var(--turn-gutter));
    max-width: calc(100% - var(--turn-gutter));
}

.thread-turn.card:has(.mark[data-open]) .mark-row,
.thread-turn.card:has(.mark[data-open]) .mark-row > :deep(.mark) {
    flex: 1;
    width: 100%;
    min-width: 0;
}
</style>
