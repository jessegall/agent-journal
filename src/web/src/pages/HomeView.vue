<script setup>
import AgentGrid from "../board/AgentGrid.vue";
import {computed} from "vue";
import SwitchCase from "../kit/SwitchCase.vue";
import EmptyState from "../kit/EmptyState.vue";
import {open} from "../domain/records.js";
import {agent} from "../state/store.js";
import Thread from "../chat/Thread.vue";
import PinnedNotices from "../chat/PinnedNotices.vue";
import FileFeed from "../chat/FileFeed.vue";
import {DEFAULT_LEVEL} from "../domain/verbosity.js";
import TerminalWindow from "../chat/TerminalWindow.vue";
import RailWaiting from "./RailWaiting.vue";
import RailTodos from "./RailTodos.vue";
import FamilyTree from "./FamilyTree.vue";

defineProps({
    view: {type: String, required: true},
    flush: Boolean,
    feed: {type: Object, default: null},
    hidden: {type: Array, default: () => []},
    level: {type: String, default: DEFAULT_LEVEL},
    floating: Boolean,
});
const emit = defineEmits(["feed"]);
const notices = computed(() => open("notice").filter((notice) => !notice.data.agent));
const feedKey = computed(() => (agent.value ? `${agent.value.n}:${agent.value.data.transcript}` : ""));
</script>

<template>
    <div :class="['home-view', view]">
        <SwitchCase :value="view">
            <template #chat>
                <PinnedNotices :notices="notices" :without-toggle="floating" />
                <Thread view="chat" :hidden="hidden" />
            </template>
            <template #feed>
                <template v-if="agent">
                    <FileFeed :key="feedKey" :agent="agent.n" :flush="flush" :options="feed" @options="emit('feed', $event)" />
                </template>
                <template v-else>
                    <EmptyState title="No agent yet">The file feed shows an agent's edits as it makes them.</EmptyState>
                </template>
            </template>
            <template #terminal><TerminalWindow :key="level" :level="level" /></template>
            <template #question><RailWaiting type="question" /></template>
            <template #suggestion><RailWaiting type="suggestion" /></template>
            <template #todos><RailTodos /></template>
            <template #family><FamilyTree /></template>
            <template #agents><AgentGrid /></template>
            <template #default><RailWaiting /></template>
        </SwitchCase>
    </div>
</template>

<style scoped>
.act-enter-active {
    transition:
        opacity 0.24s ease-out,
        transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.act-enter-from {
    opacity: 0;
    transform: translateY(-8px);
}

.act-leave-active {
    transition: opacity 0.18s ease-in;
}

.act-leave-to {
    opacity: 0;
}

.act-move {
    transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.home-view {
    --home-gutter: 24px;
    --rail-gutter: 14px;
    position: relative;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    container-type: inline-size;
}

.home-view > :deep(.thread) {
    --home-gutter: clamp(10px, 4cqi, 24px);
    padding: 0 var(--home-gutter);
}

.home-view > :deep(.thread) > :is(.dump, .terminal) {
    margin: 0 calc(-1 * var(--home-gutter));
}

.home-view:is(.waiting, .question, .suggestion, .todos) {
    overflow-y: auto;
}
</style>
