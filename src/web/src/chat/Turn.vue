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

const props = defineProps({turn: Object});
const emit = defineEmits(["reply", "edit", "grew"]);
const {openRef} = useTurnLinks();
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
const folded = ref(Boolean(props.turn.data?.collapsed));
const cardMark = computed(() => ({...data.value, detail: folded.value ? "" : data.value.detail, time: props.turn.time}));

function markClick(data) {
    if (data.go) return {click: () => go(data.go)};
    if (data.row) return {click: () => openRef(data.row)};
    return data.collapsed ? {click: () => (folded.value = !folded.value)} : {};
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
                <ChatMark :mark="cardMark" v-on="markClick(data)" />
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

.thread-turn.card.mine {
    display: flex;
    justify-content: flex-end;
}

.thread-turn.mine {
    align-self: flex-end;
    align-items: flex-end;
}
</style>
