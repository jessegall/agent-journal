<script setup>
import {pinnedNotices} from "../domain/notices.js";
import {agent} from "../composables/leadAgent.js";
import {DEFAULT_HIDDEN} from "../domain/chatVisibility.js";
import AgentGrid from "../agents/AgentGrid.vue";
import {computed} from "vue";
import SwitchCase from "../kit/SwitchCase.vue";
import EmptyState from "../kit/EmptyState.vue";
import {open} from "../domain/records.js";
import Thread from "../chat/Thread.vue";
import PinnedNotices from "../chat/PinnedNotices.vue";
import ChatNotice from "../chat/ChatNotice.vue";
import {migrationPutOff} from "../composables/migration.js";
import FileFeed from "../chat/FileFeed.vue";
import {DEFAULT_LEVEL} from "../domain/verbosity.js";
import TerminalWindow from "../chat/TerminalWindow.vue";
import RailWaiting from "../rail/RailWaiting.vue";
import TasksTab from "../tasks/TasksTab.vue";

defineProps({
    view: {type: String, required: true},
    flush: Boolean,
    feed: {type: Object, default: null},
    hidden: {type: Array, default: () => DEFAULT_HIDDEN},
    level: {type: String, default: DEFAULT_LEVEL},
    floating: Boolean,
});
const emit = defineEmits(["feed"]);
const notices = computed(() => pinnedNotices(open("notices")));
const feedKey = computed(() => (agent.value ? `${agent.value.id}:${agent.value.session}` : ""));
</script>

<template>
    <div :class="['home-view', view]">
        <SwitchCase :value="view">
            <template #chat>
                <template v-if="migrationPutOff">
                    <ChatNotice fixed :notice="{id: 0, title: 'A version 3 journal is kept in .journal/version-3, not yet brought across', link: 'migration'}" />
                </template>
                <PinnedNotices :notices="notices" :without-toggle="floating" />
                <Thread view="chat" :hidden="hidden" />
            </template>
            <template #feed>
                <template v-if="agent">
                    <FileFeed :key="feedKey" :agent="agent.id" :flush="flush" :options="feed" @options="emit('feed', $event)" />
                </template>
                <template v-else>
                    <EmptyState title="No agent yet">The file feed shows an agent's edits as it makes them.</EmptyState>
                </template>
            </template>
            <template #terminal><TerminalWindow :key="level" :level="level" /></template>
            <template #questions><RailWaiting table="questions" /></template>
            <template #tasks><TasksTab /></template>
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
