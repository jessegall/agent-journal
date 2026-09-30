<script setup>
import {computed} from "vue";
import SwitchCase from "../kit/SwitchCase.vue";
import ChatMark from "../kit/ChatMark.vue";
import SubagentMark from "./SubagentMark.vue";
import WhisperMark from "./WhisperMark.vue";
import MadeCard from "./MadeCard.vue";
import TurnGroup from "./TurnGroup.vue";
import TurnMessage from "./TurnMessage.vue";
import TurnReceipt from "./TurnReceipt.vue";
import TurnThought from "./TurnThought.vue";
import {useTurnLinks} from "./turnLinks.js";
import {store} from "../state/store.js";

const props = defineProps({turn: Object});
const emit = defineEmits(["reply", "edit", "grew", "pin"]);
const {openRef} = useTurnLinks();
const data = computed(() => props.turn.data);
const skillMark = computed(() => ({
    icon: "book",
    tone: "good",
    label: "Loaded skill",
    name: props.turn.title,
    at: props.turn.created,
    title: `Read the ${props.turn.title} skill`,
}));
const compactedMark = computed(() => ({icon: "activity", tone: "warn", label: "The agent compacted its context", at: props.turn.created}));
const cardMark = computed(() => ({...data.value, at: props.turn.created}));

function markClick(data) {
    if (data.page) return {click: () => (store.pluginPage = {plugin: data.name, open: data.page})};
    return data.row ? {click: () => openRef(data.row)} : {};
}
</script>

<template>
    <SwitchCase :value="turn.type">
        <template #skill>
            <div class="thread-turn skill" :data-ref="turn.ref">
                <ChatMark :mark="skillMark" @click="store.skill = turn.title" />
            </div>
        </template>
        <template #thought>
            <TurnThought :turn="turn" @reply="emit('reply', $event)" />
        </template>
        <template #compacted>
            <div class="thread-turn compacted" :data-ref="turn.ref">
                <ChatMark :mark="compactedMark" />
            </div>
        </template>
        <template #card>
            <div :class="['thread-turn', 'card', {mine: data.side === 'user'}]" :data-ref="turn.ref">
                <ChatMark :mark="cardMark" v-on="markClick(data)" />
            </div>
        </template>
        <template #group>
            <TurnGroup :turn="turn" @reply="emit('reply', $event)" @pin="emit('pin', $event)" />
        </template>
        <template #whisper>
            <div class="thread-turn whisper" :data-ref="turn.ref">
                <WhisperMark v-bind="data" :title="turn.title" :at="turn.created" />
            </div>
        </template>
        <template #subagent>
            <div class="thread-turn subagent" :data-ref="turn.ref">
                <SubagentMark v-bind="data" :task="turn.title" :at="turn.created" />
            </div>
        </template>
        <template #made>
            <div class="thread-turn made" :data-ref="turn.ref">
                <MadeCard :made="turn.made" />
            </div>
        </template>
        <template #receipt>
            <TurnReceipt :turn="turn" />
        </template>
        <template #default>
            <TurnMessage :turn="turn" @reply="emit('reply', $event)" @pin="emit('pin', $event)" @grew="emit('grew')" />
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
