<script setup>
import {reactive, ref} from "vue";
import Icon from "../kit/Icon.vue";

const props = defineProps({
    placeholder: {type: String, default: "Message the agent"},
    submit: {type: String, default: "Send"},
    send: Function,
});
const draft = reactive({text: "", files: [], sending: false, error: ""});
const area = ref(null);

function picked(e) {
    draft.files.push(...e.target.files);
    e.target.value = "";
}

function unpick(i) {
    draft.files.splice(i, 1);
}

async function go() {
    if (draft.sending || !draft.text.trim()) return;
    draft.sending = true;
    draft.error = "";
    try {
        await props.send(draft.text.trim(), draft.files);
        draft.text = "";
        draft.files = [];
    } catch (e) {
        draft.error = e.message;
    } finally {
        draft.sending = false;
        area.value && area.value.focus();
    }
}
</script>

<template>
    <form class="compose" @submit.prevent="go">
        <div class="compose-box floating">
            <template v-if="draft.files.length">
                <div class="compose-files">
                    <template v-for="(f, i) in draft.files" :key="i">
                        <span class="chip">
                            {{ f.name }}
                            <button type="button" class="chip-x" title="Remove" @click="unpick(i)">×</button>
                        </span>
                    </template>
                </div>
            </template>
            <textarea
                ref="area"
                v-model="draft.text"
                class="box-area"
                rows="3"
                :placeholder="placeholder"
                :aria-label="submit"
                @keydown.enter.exact="!$event.isComposing && ($event.preventDefault(), go())"
                @keydown.meta.enter.prevent="go"
                @keydown.ctrl.enter.prevent="go"
            />
            <div class="compose-foot">
                <label class="compose-attach" title="Attach files" aria-label="Attach files">
                    <Icon name="paperclip" />
                    <input type="file" multiple hidden @change="picked" />
                </label>
                <button type="submit" class="compose-send" :disabled="draft.sending || !draft.text.trim()">{{ submit }}</button>
            </div>
        </div>
        <template v-if="draft.error">
            <p class="error">{{ draft.error }}</p>
        </template>
    </form>
</template>

<style scoped>
.compose {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.compose-box {
    position: relative;
    display: flex;
    flex-direction: column;
    border: 1px solid #3b3e46;
    border-radius: 12px;
    background: #141518;
}

.compose-box:focus-within {
    border-color: #4a4e58;
}

.compose-files {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 10px 10px 0;
}

.chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 1px 6px 1px 8px;
    border: 1px solid var(--border);
    border-radius: 5px;
    background: var(--raised);
    color: var(--text-2);
    font-size: 12px;
}

.chip-x {
    border: 0;
    background: none;
    color: var(--text-3);
    padding: 0 2px;
}

.box-area {
    display: block;
    width: 100%;
    min-height: 74px;
    padding: 11px 12px 4px;
    border: 0;
    background: none;
    resize: none;
    outline: none;
    line-height: 1.45;
}

.compose-foot {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px 8px 10px;
}

.compose-attach {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    border-radius: 6px;
    color: var(--text-2);
    background: transparent;
    cursor: pointer;
}

.compose-attach:hover {
    background: var(--hover);
    color: var(--text);
}

.compose-attach .ico {
    width: 18px;
    height: 18px;
    color: inherit;
}

.compose-send {
    margin-left: auto;
    height: 32px;
    padding: 0 16px;
    border: 0;
    border-radius: 8px;
    background: var(--accent);
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
}

.compose-send:hover {
    filter: brightness(1.08);
}

.compose-send:disabled {
    opacity: 0.45;
    cursor: default;
    filter: none;
}

.error {
    margin: 0;
    color: var(--danger);
    font-size: 12px;
}
</style>
