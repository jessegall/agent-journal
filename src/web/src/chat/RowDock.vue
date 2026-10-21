<script setup>
import {computed} from "vue";
import Btn from "../kit/Btn.vue";
import ChatDock from "../kit/ChatDock.vue";
import CloseButton from "../kit/CloseButton.vue";
import Icon from "../kit/Icon.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import {useScope} from "../composables/scope.js";
import {dockedRef} from "../domain/docks.js";
import {meta} from "../domain/tables.js";
import {peek} from "../route.js";

const props = defineProps({message: Object, folded: Boolean});
const scope = useScope();
const card = computed(() => props.message.data);
const row = computed(() => dockedRef(props.message));
const kind = computed(() => meta(row.value.table));
const buttons = computed(() => (card.value.dock?.buttons || []).filter((b) => b.act !== "close"));
const folds = computed(() => props.folded && card.value.dock?.folds !== false);

function undock() {
    scope.api.act("messages", props.message.id, "undock");
}

const open = () => peek(row.value.table, row.value.id);
const OWN = {open, close: undock};
const press = (button) => (OWN[button.act] || (() => scope.api.act(row.value.table, row.value.id, button.act)))();
</script>

<template>
    <ChatDock :label="kind.title" :folded="folds">
        <template #head>
            <Icon :name="kind.icon" class="row-dock-icon" />
            <button type="button" class="row-dock-heading" :title="`Open the ${kind.title.toLowerCase()}`" @click="open">
                {{ card.heading }}
            </button>
            <span class="row-dock-acts chat-dock-acts">
                <template v-for="button in buttons" :key="button.act">
                    <Btn small @click="press(button)">{{ button.label }}</Btn>
                </template>
            </span>
            <CloseButton :title="`Hide from chat; the ${kind.title.toLowerCase()} stays on its page`" @click="undock" />
        </template>
        <template v-if="card.summary">
            <button type="button" class="row-dock-summary" @click="open">
                <TextDisplay inline :text="card.summary" />
            </button>
        </template>
    </ChatDock>
</template>

<style scoped>
.row-dock-icon {
    flex: none;
    color: var(--text-3);
}

.row-dock-heading {
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    font-weight: 500;
    text-overflow: ellipsis;
    cursor: pointer;
}

.row-dock-heading:hover {
    text-decoration: underline;
    text-decoration-color: var(--text-4);
    text-underline-offset: 3px;
}

.row-dock-acts {
    flex: none;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: auto;
}

.row-dock-summary {
    display: block;
    width: 100%;
    overflow: hidden;
    padding: 0 12px 10px 42px;
    border: 0;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12.5px;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
}
</style>
