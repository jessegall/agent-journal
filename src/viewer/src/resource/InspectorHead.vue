<script setup>
import {computed} from "vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import ResourceHeading from "./ResourceHeading.vue";
import {peekRef, shareAddress} from "../route.js";

// the head of every inspector, drawn by the journal: the panel's own actions as icons only, then the label, title and description a declaration filled in
const props = defineProps({
    label: {type: String, default: ""},
    title: {type: String, default: ""},
    description: {type: String, default: ""},
    backed: Boolean,
    stepped: Boolean,
    embedded: Boolean,
    shareable: Boolean,
    readOnly: Boolean,
    opened: {type: Object, required: true},
});
const emit = defineEmits(["close", "back", "step"]);
const address = computed(() => `${props.opened.table}:${props.opened.id}`);
const canShare = computed(() => props.shareable && !props.readOnly);
const closing = computed(() => (props.backed ? "Close all rows" : "Close"));
</script>

<template>
    <header class="inspector-head" data-inspector-head>
        <div class="inspector-icons">
            <span class="inspector-icons-start">
                <template v-if="backed">
                    <Btn variant="icon" title="Back" aria-label="Back" data-resource-back @click="emit('back')"><Icon name="back" :size="13" /></Btn>
                </template>
                <template v-if="stepped">
                    <Btn variant="icon" title="Previous" aria-label="Previous" data-inspector-step="previous" @click="emit('step', -1)"><Icon name="up" :size="13" /></Btn>
                    <Btn variant="icon" title="Next" aria-label="Next" data-inspector-step="next" @click="emit('step', 1)"><Icon name="down" :size="13" /></Btn>
                </template>
            </span>
            <span class="inspector-icons-end">
                <template v-if="embedded">
                    <Btn variant="icon" title="Open in the inspector" aria-label="Open in the inspector" data-inspector-open @click="peekRef(address)"><Icon name="open" :size="13" /></Btn>
                </template>
                <template v-if="canShare">
                    <a class="inspector-share" title="Share this row" aria-label="Share this row" data-resource-share :href="shareAddress(address)"><Icon name="share" :size="13" /></a>
                </template>
                <template v-if="!embedded">
                    <Btn variant="icon" :title="closing" :aria-label="closing" data-resource-close @click="emit('close')"><Icon name="close" :size="13" /></Btn>
                </template>
            </span>
        </div>
        <ResourceHeading :label="label" :title="title" :abstract="description" />
    </header>
</template>

<style scoped>
.inspector-head {
    padding: 10px 12px 14px 16px;
    border-bottom: 1px solid var(--border);
}

.inspector-icons {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 6px;
}

.inspector-icons-start,
.inspector-icons-end {
    display: flex;
    align-items: center;
    gap: 4px;
}

.inspector-share {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    color: var(--text-3);
}

.inspector-share:hover {
    background: var(--hover);
    color: var(--text);
}
</style>
