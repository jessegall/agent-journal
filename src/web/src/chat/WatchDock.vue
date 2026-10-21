<script setup>
import {computed} from "vue";
import ChatDock from "../kit/ChatDock.vue";
import CloseButton from "../kit/CloseButton.vue";
import Icon from "../kit/Icon.vue";
import {useScope} from "../composables/scope.js";

const SHOWN_LINES = 6;

const props = defineProps({message: {type: Object, required: true}, folded: Boolean});
const scope = useScope();
const card = computed(() => props.message.data);
const lines = computed(() => (card.value.lines?.length ? card.value.lines : [card.value.detail]).filter(Boolean).slice(-SHOWN_LINES));
const width = computed(() => `${Math.round((card.value.fraction || 0) * 100)}%`);

function undock() {
    scope.api.act("messages", props.message.id, "undock");
}
</script>

<template>
    <ChatDock label="Watched output" :folded="folded" kind="watch-dock">
        <template #head>
            <Icon name="terminal" class="watch-dock-icon" />
            <span class="watch-dock-label">{{ message.text }}</span>
            <template v-if="card.ending">
                <span class="watch-dock-ending">{{ card.ending }}</span>
            </template>
            <template v-else-if="card.figure">
                <span class="watch-dock-figure">{{ card.figure }}</span>
            </template>
            <CloseButton title="Take the watched output down from above the chat" @click="undock" />
        </template>
        <ul class="watch-dock-lines">
            <template v-for="line in lines" :key="line">
                <li>{{ line }}</li>
            </template>
        </ul>
        <template v-if="card.figure">
            <div class="watch-dock-bar">
                <div class="watch-dock-fill" :style="{width}"></div>
            </div>
        </template>
    </ChatDock>
</template>

<style scoped>
.watch-dock-icon {
    flex: none;
    color: var(--text-3);
}

.watch-dock-label {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    color: var(--text-2);
    text-overflow: ellipsis;
    white-space: nowrap;
}

.watch-dock-figure,
.watch-dock-ending {
    flex: none;
    color: var(--text-3);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
}

.watch-dock-lines {
    margin: 0;
    padding: 0;
    color: var(--text-3);
    font-family: var(--mono, monospace);
    font-size: 11px;
    line-height: 1.5;
    list-style: none;
    overflow-wrap: anywhere;
}

.watch-dock-bar {
    height: 2px;
    margin-top: 6px;
    border-radius: 1px;
    background: var(--border);
    overflow: hidden;
}

.watch-dock-fill {
    height: 100%;
    background: var(--accent);
    transition: width 0.4s ease;
}
</style>
