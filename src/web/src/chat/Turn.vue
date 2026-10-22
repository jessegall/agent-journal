<script setup>
import {computed, ref} from "vue";
import SwitchCase from "../kit/SwitchCase.vue";
import ChatMark from "../kit/ChatMark.vue";
import SubagentMark from "./SubagentMark.vue";
import WhisperMark from "./WhisperMark.vue";
import MadeCard from "./MadeCard.vue";
import SuggestionCard from "./SuggestionCard.vue";
import TurnGroup from "./TurnGroup.vue";
import TurnMessage from "./TurnMessage.vue";
import TurnThought from "./TurnThought.vue";
import {useTurnLinks} from "./turnLinks.js";
import {go} from "../route.js";
import {store} from "../state/store.js";
import {useScope} from "../composables/scope.js";

const props = defineProps({turn: Object});
const emit = defineEmits(["reply", "edit", "grew"]);
const {openRef} = useTurnLinks();
const scope = useScope();
const dock = () => scope.api.act("messages", props.turn.id, "dock");
const data = computed(() => props.turn.data);
const skillMark = computed(() => ({
    icon: "book",
    tone: "good",
    label: "Loaded skill",
    name: props.turn.title,
    time: props.turn.time,
    title: `Read the ${props.turn.title} skill`,
}));
const compactedMark = computed(() => ({icon: "activity", tone: "warn", label: "Conversation compacted", time: props.turn.time}));
const opened = ref(false);
const cardMark = computed(() => ({...data.value, detail: data.value.collapsed ? "" : data.value.detail, time: props.turn.time}));
const lines = computed(() => (data.value.lines || []).filter(Boolean));

function markClick(data) {
    if (data.go) return {click: () => go(data.go)};
    if (data.row) return {click: () => openRef(data.row)};
    return lines.value.length ? {click: () => (opened.value = !opened.value)} : {};
}
</script>

<template>
    <SwitchCase :value="turn.kind">
        <template #skill>
            <div class="thread-turn skill" :data-ref="turn.key">
                <ChatMark :mark="skillMark" @click="store.skill = turn.title" />
            </div>
        </template>
        <template #thought>
            <TurnThought :turn="turn" @reply="emit('reply', $event)" />
        </template>
        <template #compacted>
            <div class="thread-turn compacted" :data-ref="turn.key">
                <ChatMark :mark="compactedMark" />
            </div>
        </template>
        <template #card>
            <div :class="['thread-turn', 'card', {mine: data.side === 'user'}]" :data-ref="turn.key">
                <span class="mark-row">
                    <ChatMark :mark="cardMark" v-on="markClick(data)">
                        <template v-if="opened && lines.length">
                            <ul class="mark-lines">
                                <template v-if="data.line">
                                    <li class="mark-line mark-command">{{ data.line }}</li>
                                </template>
                                <template v-for="line in lines" :key="line">
                                    <li class="mark-line">{{ line }}</li>
                                </template>
                            </ul>
                        </template>
                    </ChatMark>
                    <template v-if="data.output && !data.docked && !data.ending">
                        <button type="button" class="mark-dock" title="Dock the live view above the chat" @click="dock">Dock</button>
                    </template>
                </span>
            </div>
        </template>
        <template #group>
            <TurnGroup :turn="turn" @reply="emit('reply', $event)" />
        </template>
        <template #whisper>
            <div class="thread-turn whisper" :data-ref="turn.key">
                <WhisperMark v-bind="data" :title="turn.title" :time="turn.time" />
            </div>
        </template>
        <template #subagent>
            <div class="thread-turn subagent" :data-ref="turn.key">
                <SubagentMark v-bind="data" :task="turn.title" :time="turn.time" />
            </div>
        </template>
        <template #made>
            <div class="thread-turn made" :data-ref="turn.key">
                <MadeCard :made="turn.made" />
            </div>
        </template>
        <template #suggestion>
            <div class="thread-turn suggestion" :data-ref="turn.key">
                <SuggestionCard :suggestion="turn.suggestion" />
            </div>
        </template>
        <template #default>
            <TurnMessage :turn="turn" @reply="emit('reply', $event)" @grew="emit('grew')" />
        </template>
    </SwitchCase>
</template>

<style scoped>
.thread-turn {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    align-self: flex-start;
    --turn-gutter: 48px;

    gap: 3px;
    max-width: min(78%, calc(100% - var(--turn-gutter)));
}

.thread-turn.suggestion {
    width: min(580px, calc(100% - var(--turn-gutter)));
}

.thread-turn.compacted {
    align-items: center;
}

.mark-lines {
    grid-column: 1 / -1;
    margin: 0;
    padding: 2px 0 0 22px;
    text-align: left;
    color: var(--text-3);
    font-size: 11px;
    line-height: 1.4;
    list-style: none;
    overflow-wrap: anywhere;
}

.mark-command {
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
}

.mark-row {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    max-width: 100%;
}

.mark-dock {
    padding: 1px 7px;
    border: 1px solid var(--border-2);
    border-radius: 5px;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 11px;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.15s ease;
}

.thread-turn.card:hover .mark-dock,
.mark-dock:focus-visible {
    opacity: 1;
}

.mark-dock:hover {
    color: var(--text-2);
    border-color: var(--border);
}

.thread-turn.card.mine {
    display: flex;
    justify-content: flex-end;
}

.thread-turn.mine {
    align-self: flex-end;
    align-items: flex-end;
}
</style>
