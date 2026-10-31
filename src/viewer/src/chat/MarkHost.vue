<script setup>
import {computed, ref} from "vue";
import ChatMark from "../kit/ChatMark.vue";
import MarkBody from "./MarkBody.vue";
import MarkButtons from "./MarkButtons.vue";
import {markDeclaration} from "../domain/markRegistry.js";
import {markLook} from "../domain/markLook.js";

// one chat mark of any declared type, drawn by version 4's ChatMark from the type's declaration
const props = defineProps({mark: {type: Object, required: true}, allowedRuns: {type: Array, default: null}});
const declaration = computed(() => markDeclaration(props.mark.type));
const look = computed(() => markLook(props.mark, declaration.value));
// a mark with lines, an output or a body of its module's own opens in place on a click, and folds on the next; its row's action stays its own
const opens = computed(() => Boolean(props.mark.lines || props.mark.target_model === "output" || declaration.value?.body_url));
const opened = ref(false);
</script>

<template>
    <div class="thread-turn card" :data-ref="`chat_mark:${mark.id}`">
        <span class="mark-row">
            <ChatMark :mark="look" :open="opens ? opened : undefined" v-on="look.handlers" @click="opened = !opened">
                <template v-if="opens" #default="{shown}">
                    <MarkBody :declaration="declaration || {}" :mark="mark" :shown="shown" />
                </template>
            </ChatMark>
            <MarkButtons :buttons="declaration?.buttons" :mark="mark" :allowed-runs="allowedRuns" />
        </span>
    </div>
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

.mark-row {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    max-width: 100%;
}

:global(html.phone .mark-row) {
    gap: 4px;
}

/* an opened mark may take the chat's whole width, past the share a folded line keeps */
.thread-turn.card:has(.mark[data-open]) {
    max-width: calc(100% - var(--turn-gutter));
}
</style>
