<script setup>
import {inject} from "vue";
import Dot from "../kit/Dot.vue";
import Icon from "../kit/Icon.vue";
import {state} from "../domain/records.js";
import {isClosed} from "../domain/row.js";

defineProps({task: {type: Object, required: true}});
const emit = defineEmits(["open"]);
const talk = inject("talk", null);
</script>

<template>
    <div class="line">
        <button type="button" :class="['row', {completed: isClosed(task)}]" @click="emit('open', task)">
            <Dot :kind="state(task)" />
            <span class="rn">#{{ task.id }}</span>
            <span class="rt">{{ task.title }}</span>
        </button>
        <template v-if="talk">
            <button type="button" class="say" title="Comment on this task" @click="talk.say(`#${task.id} ${task.title}`)">
                <Icon name="bubble" :size="12" />
            </button>
        </template>
    </div>
</template>

<style scoped>
.line {
    display: flex;
    align-items: center;
    min-width: 0;
}

.row {
    flex: 0 1 auto;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    padding: 4px 6px 4px 24px;
    border: 0;
    background: none;
    color: var(--text-2);
    text-align: left;
    cursor: pointer;
}

.row:hover {
    color: var(--text);
}

.row.completed .rt {
    text-decoration: line-through;
    color: var(--text-3);
}

.rn {
    color: var(--text-3);
    font-size: 12px;
}

.say {
    flex: none;
    display: inline-flex;
    padding: 3px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    opacity: 0;
    cursor: pointer;
}

.line:hover .say,
.say:focus-visible {
    opacity: 1;
}

.say:hover {
    color: var(--accent-text);
}
</style>
