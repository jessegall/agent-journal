<script setup>
import {withFrame} from "../domain/mascots.js";

const props = defineProps({edit: {type: Object, required: true}, at: {type: Number, default: 0}, count: {type: Number, default: 0}, locked: Boolean});
const emit = defineEmits(["change"]);

const frame = (name) => props.edit.frames?.[props.at]?.[name] || 0;
const number = (event) => Number(event.target.value) || 0;
const set = (name, event) => emit("change", withFrame(props.edit, props.count, props.at, {[name]: number(event)}));
const setAll = (event) => emit("change", {...withFrame(props.edit, props.count, props.at, {}), ms: number(event)});
</script>

<template>
    <div class="frame-fields">
        <h4>Frame {{ at + 1 }} of {{ count }}</h4>
        <template v-if="locked">
            <p class="frame-fields-hint">Pause to edit a frame.</p>
        </template>
        <label>
            Move right, in pixels
            <input type="number" :value="frame('x')" :disabled="locked" @input="set('x', $event)" />
        </label>
        <label>
            Move down, in pixels
            <input type="number" :value="frame('y')" :disabled="locked" @input="set('y', $event)" />
        </label>
        <label>
            Hold this frame, in milliseconds
            <input type="number" min="0" :value="frame('ms')" :placeholder="edit.ms || 286" :disabled="locked" @input="set('ms', $event)" />
        </label>
        <label>
            Hold every frame, in milliseconds
            <input type="number" min="0" :value="edit.ms || 0" placeholder="286" @input="setAll" />
        </label>
    </div>
</template>

<style scoped>
.frame-fields {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

h4 {
    margin: 0;
    font-size: 13px;
}

.frame-fields-hint {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

label {
    display: flex;
    flex-direction: column;
    gap: 3px;
    color: var(--text-2);
    font-size: 12px;
}

input {
    padding: 5px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: transparent;
    color: var(--text);
    font: inherit;
}
</style>
