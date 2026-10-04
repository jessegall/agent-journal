<script setup>
import Btn from "../kit/Btn.vue";
import Dialog from "../kit/Dialog.vue";
import TextInput from "../kit/TextInput.vue";

const repository = defineModel("repository", {type: String, default: ""});
const wish = defineModel("wish", {type: String, default: ""});
const emit = defineEmits(["close", "guide", "ask"]);
</script>

<template>
    <Dialog title="Make a new plugin" small fits @close="emit('close')">
        <div class="ask">
            <p class="ask-lead">The agent builds it for you and answers in the chat.</p>
            <TextInput
                :value="repository"
                placeholder="A GitHub repository to build it in (optional)"
                @input="repository = $event.target.value"
            />
            <textarea v-model="wish" class="wish" rows="4" placeholder="What should the plugin do?" />
        </div>
        <template #foot>
            <Btn @click="emit('guide')">Read how to make one</Btn>
            <Btn kind="primary" :disabled="!repository.trim() && !wish.trim()" @click="emit('ask')">Send to the agent</Btn>
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
