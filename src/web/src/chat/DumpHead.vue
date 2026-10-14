<script setup>
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import InlineName from "../kit/InlineName.vue";
import DumpPill from "./DumpPill.vue";
import {store} from "../state/store.js";

defineProps({dump: {type: Object, default: null}, collection: {type: String, default: ""}, phase: {type: String, default: ""}});
const renaming = defineModel("renaming", {type: Boolean, default: false});
const emit = defineEmits(["rename"]);
</script>

<template>
    <header class="dump-head">
        <Icon name="inbox" :size="14" />
        <template v-if="dump">
            <span class="dump-title">Dump {{ dump.n }}</span>
            <template v-if="renaming">
                <InlineName class="dump-rename" :value="collection" @done="(title) => emit('rename', title)" @cancel="renaming = false" />
            </template>
            <template v-else-if="collection">
                <button type="button" class="dump-collection" title="Rename the collection" @click="renaming = true">
                    <span class="dump-collection-name">{{ collection }}</span>
                    <Icon name="pencil" :size="11" />
                </button>
            </template>
            <DumpPill :phase="phase" />
        </template>
        <template v-else>
            <span class="dump-title">New dump</span>
        </template>
        <span class="grow" />
        <template v-if="dump">
            <Btn small @click="store.dumpSelected = 0">New dump</Btn>
        </template>
        <Btn small @click="store.dumping = false">Back to chat</Btn>
    </header>
</template>

<style scoped>
.dump-head {
    display: flex;
    flex: none;
    align-items: center;
    gap: 9px;
    min-height: 44px;
    padding: 6px 12px 6px 16px;
    border-bottom: 1px solid var(--border);
    color: var(--text-3);
}

.dump-head > :deep(.ico) {
    color: var(--accent-text);
}

.dump-title {
    font-size: 13px;
    color: var(--text);
    white-space: nowrap;
}

.dump-collection {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    padding: 2px 6px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 13px;
    cursor: pointer;
}

.dump-collection-name {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.dump-collection :deep(.ico) {
    opacity: 0;
    transition: opacity 0.15s;
}

.dump-collection:hover {
    background: var(--hover);
    color: var(--text);
}

.dump-collection:hover :deep(.ico) {
    opacity: 1;
}

.dump-rename {
    max-width: 360px;
}

.grow {
    flex: 1;
}
</style>
