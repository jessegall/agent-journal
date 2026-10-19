<script setup>
import {nextTick, ref} from "vue";
import Btn from "../kit/Btn.vue";
import MenuLabel from "../kit/MenuLabel.vue";
import SidePanel from "../kit/SidePanel.vue";

const props = defineProps({
    about: {type: String, required: true},
    text: {type: String, required: true},
    fillers: {type: Array, required: true},
});
const emit = defineEmits(["update", "close"]);
const messageBox = ref(null);

// a value is put where the cursor is, and the cursor stays in the box
function insertFiller(filler) {
    const box = messageBox.value;
    const at = box ? box.selectionStart : props.text.length;
    emit("update", `${props.text.slice(0, at)}${filler.key}${props.text.slice(at)}`);
    if (box) nextTick(() => box.focus());
}
</script>

<template>
    <SidePanel title="Message to the agent" :abstract="about" @close="emit('close')">
        <textarea
            ref="messageBox"
            class="chart-message"
            :value="text"
            rows="10"
            placeholder="Message to the agent"
            @input="emit('update', $event.target.value)"
        />
        <MenuLabel>Values you can insert</MenuLabel>
        <div class="chart-fillers">
            <template v-for="filler in fillers" :key="filler.key">
                <button type="button" class="chart-filler" @click="insertFiller(filler)">
                    <code>{{ filler.key }}</code>
                    <span>{{ filler.about }}</span>
                </button>
            </template>
        </div>
        <template #foot>
            <span class="chart-grow" />
            <Btn kind="primary" small @click="emit('close')">Done</Btn>
        </template>
    </SidePanel>
</template>

<style scoped>
.chart-grow {
    flex: 1;
}

.chart-message {
    width: 100%;
    margin: 0 0 16px;
    padding: 10px 12px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--bg-2);
    color: var(--text);
    font: inherit;
    font-size: 13px;
    line-height: 1.5;
    resize: vertical;
}

.chart-message:focus {
    border-color: var(--accent);
    outline: none;
}

.chart-fillers {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.chart-filler {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 8px;
    border: 1px solid transparent;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12.5px;
    text-align: left;
    cursor: pointer;
}

.chart-filler:hover {
    border-color: var(--border-2);
    background: var(--hover);
    color: var(--text);
}

.chart-filler code {
    flex: none;
    color: var(--accent-text);
    font-family: var(--mono);
    font-size: 12px;
}
</style>
