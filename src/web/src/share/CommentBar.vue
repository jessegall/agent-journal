<script setup>
import {computed, ref} from "vue";
import {sendComment} from "../api/shared.js";
import QuickCommentBar from "../kit/QuickCommentBar.vue";
import TextInput from "../kit/TextInput.vue";
import {visitorName, rememberName} from "./visitor.js";

const props = defineProps({
    on: {type: String, required: true},
    sent: {type: Array, required: true},
    count: {type: Number, default: 0},
    draft: {type: String, default: ""},
    error: {type: String, default: ""},
});
const emit = defineEmits(["update:sent", "update:draft", "update:error", "show"]);
const name = ref(visitorName.value);
const naming = ref(!name.value);
const draft = computed({get: () => props.draft, set: (value) => emit("update:draft", value)});
const error = computed({get: () => props.error, set: (value) => emit("update:error", value)});

async function send(text) {
    const waiting = {id: -Date.now(), on: props.on, name: name.value.trim(), text, created: Date.now() / 1000, waiting: true};
    emit("update:sent", [...props.sent, waiting]);
    try {
        await sendComment(props.on, name.value.trim(), text);
        rememberName(name.value.trim());
        naming.value = false;
    } catch (e) {
        emit(
            "update:sent",
            props.sent.filter((c) => c.id !== waiting.id)
        );
        throw e;
    }
}
</script>

<template>
    <QuickCommentBar
        v-model:draft="draft"
        v-model:error="error"
        :send="send"
        :count="count"
        :ready="Boolean(name.trim())"
        placeholder="Write a comment. Everyone with this link can read it."
        @show="emit('show')"
    >
        <template #who>
            <div class="who">
                <template v-if="naming">
                    <TextInput
                        class="name"
                        :value="name"
                        label="Your name"
                        maxlength="40"
                        autocomplete="name"
                        placeholder="Shown with your comment"
                        @input="name = $event.target.value"
                    />
                </template>
                <template v-else>
                    <span class="as">
                        Commenting as
                        <b>{{ name }}</b>
                    </span>
                    <button type="button" class="change" @click="naming = true">Change name</button>
                </template>
            </div>
        </template>
    </QuickCommentBar>
</template>

<style scoped>
.who {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 20px;
}

.name {
    flex: 1;
}

.as {
    color: var(--text-3);
    font-size: 12.5px;
}

.as b {
    color: var(--text);
    font-weight: 500;
}

.change {
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-size: 12.5px;
    cursor: pointer;
}
</style>
