<script setup>
import {computed, nextTick, ref, watch} from "vue";
import {chatTurns, fromMainAgent} from "../domain/transcript.js";
import Turn from "./Turn.vue";
import JumpPill from "../kit/JumpPill.vue";
import Skeleton from "../kit/Skeleton.vue";
import {useFollow} from "../composables/follow.js";
import {useScrollback} from "../composables/scrollback.js";

const props = defineProps({
    turns: {type: Array, required: true},
    loading: Boolean,
    session: {type: String, required: true},
    task: {type: String, default: ""},
    earlier: {type: Function, default: async () => false},
    atStart: {type: Boolean, default: true},
});
const log = ref(null);
const lines = computed(() => fromMainAgent(chatTurns(props.turns)));
const {following, unseen, snap, landed, jump, scrolled, wheeled} = useFollow(log);
const top = ref(null);
const {loading: loadingOlder} = useScrollback(log, top, () => props.earlier(), {ready: () => !props.atStart && !props.loading && lines.value.length > 0});
watch(
    () => lines.value.length,
    (now, before) => nextTick(() => (before === undefined ? snap() : landed(now - before))),
    {immediate: true}
);
</script>

<template>
    <div class="subagent-chat">
        <div class="frame">
            <div ref="log" class="log" @scroll.passive="scrolled" @wheel.passive="wheeled">
                <div ref="top" />
                <template v-if="loadingOlder">
                    <Skeleton shape="older" label="Loading older messages" />
                </template>
                <template v-for="turn in lines" :key="turn.key">
                    <Turn :turn="turn" />
                </template>
                <template v-if="!lines.length && loading">
                    <Skeleton shape="messages" label="Loading the conversation" />
                </template>
                <template v-else-if="!lines.length">
                    <p class="none">Nothing said yet.</p>
                </template>
            </div>
            <template v-if="!following && lines.length">
                <JumpPill :count="unseen" @jump="jump" />
            </template>
        </div>
    </div>
</template>

<style scoped>
.subagent-chat {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
}

.composer {
    flex: none;
    padding: 0 24px 16px;
}

.frame {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
}

.log {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 6px;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 12px 24px;
}

.pins {
    display: flex;
    flex: none;
    flex-direction: column;
}

.none {
    margin: 0;
    color: var(--text-3);
    font-size: 13px;
}
</style>
