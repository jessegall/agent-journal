<script setup>
import {Btn, Dialog, TextInput} from "@journal/window-kit";

// asking the agent to make a plugin, as version 4 asked: where it may build it and what it should do
const repository = defineModel("repository", {type: String, default: ""});
const wish = defineModel("wish", {type: String, default: ""});
const emit = defineEmits(["close", "guide", "ask"]);
</script>

<template>
    <Dialog title="Create a plugin" small fits @close="emit('close')">
        <form class="ask" data-plugin-make-form @submit.prevent="emit('ask')">
            <p class="ask-lead">The agent builds it for you and answers in the chat.</p>
            <TextInput v-model="repository" placeholder="A GitHub repository to build it in (optional)" aria-label="GitHub repository" />
            <textarea v-model="wish" class="wish" rows="4" placeholder="What should the plugin do?" aria-label="What should the plugin do?" />
        </form>
        <template #foot>
            <Btn data-plugin-guide-open @click="emit('guide')">Read how to make one</Btn>
            <Btn variant="primary" data-plugin-make-send :disabled="!repository.trim() && !wish.trim()" @click="emit('ask')">Send to the agent</Btn>
        </template>
    </Dialog>
</template>

<style scoped>
.ask {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.ask-lead {
    margin: 0 0 4px;
    color: var(--text-3);
    font-size: 12.5px;
}

.wish {
    padding: 7px 9px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: 12.5px;
    resize: vertical;
}

.wish:focus {
    outline: none;
    border-color: var(--accent);
}
</style>
