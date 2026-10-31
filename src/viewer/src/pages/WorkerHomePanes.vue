<script setup>
import {computed, provide, ref, watch} from "vue";
import {api} from "../api/client.js";
import EmptyState from "../kit/EmptyState.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import AgentPanes from "../agents/AgentPanes.vue";
import LayoutPicker from "../agents/LayoutPicker.vue";
import FileFeed from "../chat/FileFeed.vue";
import TerminalWindow from "../chat/TerminalWindow.vue";
import Thread from "../chat/Thread.vue";
import TranscriptLog from "../resource/TranscriptLog.vue";
import {usePoll} from "../composables/poll.js";
import {useWorkerHomeLayout} from "../composables/paneLayout.js";
import {scopeOfChat} from "../composables/scope.js";
import {useTranscript} from "../composables/transcript.js";
import {INSPECTOR_FEED, WORKER_HOME_PRESETS, WORKER_HOME_SHAPE} from "../domain/panes.js";
import {levelOf} from "../domain/verbosity.js";
import {holding, rows} from "../sync/rows.js";

const props = defineProps({worker: {type: Object, required: true}});
const VIEWS = {
    chat: {title: "Chat", icon: "chat"},
    transcript: {title: "Transcript", icon: "list"},
    terminal: {title: "Terminal", icon: "terminal"},
    feed: {title: "Files changed", icon: "edits"},
};
const AVAILABLE = Object.keys(VIEWS);

// the worker's own chat: its messages, and a box that writes to it as the user
const scope = scopeOfChat(props.worker.session, (text) => api.act("workers", props.worker.id, "message", {text}));
provide("scope", scope);
usePoll("worker.chat", {params: () => ({scope})});

const agent = computed(() => rows("agents").find((row) => row.id === props.worker.agent) || null);
watch(
    () => props.worker.agent,
    (id) => id && holding("agents", [id]),
    {immediate: true}
);

const transcripts = {env: () => api.env(), transcript: (_agent, _session, fields) => api.workerTranscript(props.worker.id, fields)};
const log = ref(null);
const scroller = computed(() => log.value && log.value.scroller);
const transcript = useTranscript(() => "worker", "", scroller, transcripts);

const arrangement = useWorkerHomeLayout(props.worker.id);
const panes = ref(null);
</script>

<template>
    <div class="worker-home-panes">
        <div class="worker-home-tools">
            <LayoutPicker
                :presets="WORKER_HOME_PRESETS"
                :layout="panes ? panes.layout : null"
                tip="How this worker's panes are laid out"
                @pick="(shape) => panes.shape(shape)"
            />
        </div>
        <AgentPanes ref="panes" :views="VIEWS" :available="AVAILABLE" :flushable="['feed']" :arrangement="arrangement" :shape="WORKER_HOME_SHAPE">
            <template #view="{view, pane, tune}">
                <SwitchCase :value="view">
                    <template #chat>
                        <Thread view="chat" />
                    </template>
                    <template #transcript>
                        <TranscriptLog ref="log" class="fill" :transcript="transcript" :entries="transcript.turns" :env="''" />
                    </template>
                    <template #terminal>
                        <template v-if="agent">
                            <TerminalWindow :key="`${agent.id}:${levelOf(pane)}`" class="fill" :agent="agent" :level="levelOf(pane)" />
                        </template>
                        <template v-else>
                            <EmptyState title="No agent yet">Its terminal shows here once the worker starts.</EmptyState>
                        </template>
                    </template>
                    <template #feed>
                        <template v-if="agent">
                            <FileFeed
                                :key="agent.id"
                                :agent="agent.id"
                                :flush="!!pane.flush"
                                :options="pane.feed || null"
                                :defaults="INSPECTOR_FEED"
                                @options="(feed) => tune({feed})"
                            />
                        </template>
                        <template v-else>
                            <EmptyState title="No agent yet">Its edits show here once the worker starts.</EmptyState>
                        </template>
                    </template>
                </SwitchCase>
            </template>
        </AgentPanes>
    </div>
</template>

<style scoped>
.worker-home-panes {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
}

.worker-home-tools {
    display: flex;
    flex: none;
    justify-content: flex-end;
    padding: 0 16px 6px;
}

.worker-home-panes :deep(.thread) {
    --home-gutter: 24px;
    padding: 0 var(--home-gutter);
}

.fill {
    flex: 1;
    min-height: 0;
    max-height: none;
}
</style>
