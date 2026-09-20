<script setup>
import {ref} from "vue";
import {act} from "../api.js";
import {route} from "../route.js";

const props = defineProps({file: {type: Object, required: true}});
const editing = ref(false);
const draft = ref("");

function edit() {
    draft.value = props.file.what || "";
    editing.value = true;
}

function cancel() {
    editing.value = false;
}

async function save() {
    const tags = draft.value.trim();
    editing.value = false;
    if (tags !== props.file.what) {
        await act(route.value.env, props.file.type, props.file.n, "tag", {name: props.file.name, tags});
        props.file.what = tags;
    }
}
</script>

<template>
    <template v-if="editing">
        <input
            v-model="draft"
            class="editor"
            aria-label="File tags"
            autofocus
            @blur="save"
            @keydown.enter.prevent="save"
            @keydown.esc.prevent="cancel"
        />
    </template>
    <template v-else>
        <button type="button" class="tags" :class="{empty: !file.what}" @click="edit">{{ file.what || "Add tags" }}</button>
    </template>
</template>

<style scoped>
.tags,
.editor {
    display: block;
    width: 100%;
    min-width: 0;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-2);
    font: inherit;
    text-align: left;
}

.tags {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: text;
}

.tags.empty {
    color: var(--text-3);
}

.editor {
    outline: none;
    box-shadow: 0 1px 0 var(--accent-text);
}
</style>
