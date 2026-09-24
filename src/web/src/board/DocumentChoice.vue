<script setup>
import {ref} from "vue";
import Btn from "../kit/Btn.vue";
import FileSlip from "../kit/FileSlip.vue";
import Icon from "../kit/Icon.vue";
import TextInput from "../kit/TextInput.vue";

const props = defineProps({chosen: Boolean, file: {type: Object, default: null}, shortcut: {type: String, default: ""}});
const steer = defineModel("steer", {type: String, default: ""});
const emit = defineEmits(["choose", "file", "clear"]);
const picker = ref(null);
const browse = () => picker.value.click();
const picked = (e) => e.target.files[0] && emit("file", e.target.files[0]);
const pressed = () => (props.file ? emit("choose") : browse());

defineExpose({browse});
</script>

<template>
    <div :class="['document-choice', {chosen}]" @click="!chosen && pressed()">
        <div class="document-choice-top">
            <Icon name="docs" class="document-choice-icon" />
            <div class="document-choice-words">
                <span class="document-choice-name">
                    From a document
                    <template v-if="shortcut">
                        <span class="document-choice-key">{{ shortcut }}</span>
                    </template>
                </span>
                <template v-if="!file">
                    <span class="document-choice-line">
                        I read it, choose the stages and fill them with tickets. A roadmap, a spec, a plan or meeting notes.
                    </span>
                </template>
            </div>
            <template v-if="!file">
                <span class="document-choice-drop">
                    <Btn small @click.stop="browse">Choose a document</Btn>
                    <span class="document-choice-hint">or drop or paste one here</span>
                </span>
            </template>
            <template v-else>
                <span class="document-choice-check" aria-hidden="true">✓</span>
            </template>
        </div>
        <template v-if="file">
            <FileSlip :file="file" removable @remove="emit('clear')" />
            <TextInput
                label="Anything to know?"
                placeholder="Keep stages simple, five at most"
                :value="steer"
                @input="steer = $event.target.value"
                @click.stop
            />
        </template>
        <input ref="picker" type="file" hidden @change="picked" />
    </div>
</template>

<style scoped>
.document-choice {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 14px 16px;
    border: 1px dashed var(--border-3);
    border-radius: 12px;
    cursor: pointer;
    transition:
        border-color 0.15s,
        background 0.15s;
}

.document-choice:hover {
    border-color: var(--text-4);
    background: var(--hover);
}

.document-choice.chosen,
.document-choice.chosen:hover {
    border: 1px solid var(--accent);
    background: var(--raised);
    box-shadow: 0 0 0 1px var(--accent);
    cursor: default;
}

.document-choice-top {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
}

.document-choice-icon {
    flex: none;
    color: var(--accent-text);
}

.document-choice-words {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
}

.document-choice-name {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text);
    font-weight: 500;
}

.document-choice-key {
    color: var(--text-4);
    font-family: var(--mono);
    font-size: 11px;
    font-weight: 400;
}

.document-choice-line,
.document-choice-hint {
    color: var(--text-3);
    font-size: 12.5px;
}

.document-choice-drop {
    display: flex;
    flex: none;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
}

.document-choice-hint {
    color: var(--text-4);
    font-size: 11.5px;
}

.document-choice-check {
    display: grid;
    flex: none;
    place-items: center;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--accent);
    color: var(--text);
    font-size: 11px;
}

@media (max-width: 560px) {
    .document-choice-top {
        flex-wrap: wrap;
    }

    .document-choice-drop {
        align-items: flex-start;
        width: 100%;
    }
}
</style>
