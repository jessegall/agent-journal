<script setup>
import {computed} from "vue";
import {Btn} from "@journal/window-kit";

const TYPE_WORDS = {doc: "Document", sequence: "Sequence", check: "Check"};
const BUTTONS = {
    compare: "Compare",
    read: "Read",
    mine: "Keep mine",
    send: "Send",
    library: "Use the library's version",
    leave: "Stop following",
};
const STATUS_BUTTONS = {
    synced: ["leave"],
    sending: [],
    unsent: [],
    paused: [],
    denied: ["compare", "library"],
    rejected: ["compare"],
    conflict: ["compare", "mine", "library"],
    review: ["read", "library", "leave"],
    removed: ["leave"],
    agent: ["compare", "send", "library"],
};
const ROLE_WORDS = {admin: "Admin", edit: "Edit", read: "Read-only"};

// one item that follows an item of the library: its status as a label and a value, the line that says why, and the buttons that status allows
const props = defineProps({copy: {type: Object, required: true}, role: {type: String, required: true}});
const emit = defineEmits(["choose"]);

const buttons = computed(() => STATUS_BUTTONS[props.copy.status].map((key) => ({key, label: BUTTONS[key]})));
const lines = computed(() => {
    const extra = [];
    if (props.copy.status === "denied") extra.push(`Role: ${ROLE_WORDS[props.role]}`);
    if (props.copy.status === "denied" && props.copy.server_version > props.copy.version) extra.push("A newer version is in the library");
    if (props.copy.status === "agent") extra.push("An agent changed this item. A person sends it to the team.");
    if (props.copy.status === "removed") extra.push("Your copy stays on this journal.");
    if (props.copy.note) extra.push(props.copy.note);
    return extra;
});
</script>

<template>
    <li class="copy" :data-library-copy="copy.copy_id" :data-status="copy.status">
        <span class="copy-title">{{ TYPE_WORDS[copy.share] }} {{ copy.row_id }}, {{ copy.local_fields.title }}</span>
        <span class="copy-facts" data-copy-facts>Status: {{ copy.label }}, Version: {{ copy.version }}</span>
        <template v-for="line in lines" :key="line">
            <span class="copy-line" data-copy-line>{{ line }}</span>
        </template>
        <span class="copy-buttons">
            <template v-for="button in buttons" :key="button.key">
                <Btn small :variant="button.key === 'library' ? 'primary' : undefined" :data-copy-button="button.key" @click="emit('choose', copy, button.key)">{{ button.label }}</Btn>
            </template>
        </span>
    </li>
</template>

<style scoped>
.copy {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 8px 0;
}

.copy-title {
    font-weight: 600;
}

.copy-facts,
.copy-line {
    color: var(--text-3);
    font-size: 12px;
}

.copy-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 4px;
}
</style>
