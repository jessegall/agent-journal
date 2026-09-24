<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import PageThumb from "../kit/PageThumb.vue";
import ProgressBar from "../kit/ProgressBar.vue";

const props = defineProps({board: {type: Object, required: true}, tickets: {type: Number, default: 0}});
const emit = defineEmits(["removed", "refused"]);
const building = computed(() => props.board.data.building);
const done = computed(() => Boolean(building.value.done));
const log = computed(() => building.value.log || []);
const latest = computed(() => (log.value.length ? log.value[log.value.length - 1].text : "Reading the document"));
const extension = computed(() => building.value.document.split(".").pop());
const counted = computed(() => (props.tickets === 1 ? "1 ticket so far" : `${props.tickets} tickets so far`));
const listing = ref(false);
const busy = ref(false);

async function act(action) {
    busy.value = true;
    try {
        await api.act("board", props.board.n, action);
        if (action === "discard") emit("removed", props.board.n);
    } catch (e) {
        emit("refused", e);
    } finally {
        busy.value = false;
    }
}
</script>

<template>
    <section :class="['build-strip', {done}]">
        <div class="build-strip-bar">
            <PageThumb :lines="done ? 7 : 3" :label="extension" :fresh="!done" />
            <div class="build-strip-words">
                <template v-if="done">
                    <span class="build-strip-line">Built from {{ building.document }}. {{ building.summary }}</span>
                </template>
                <template v-else>
                    <span class="build-strip-line">{{ latest }}</span>
                    <span class="build-strip-meta">{{ building.document }} · {{ counted }}</span>
                    <ProgressBar :value="0" busy thin />
                </template>
            </div>
            <template v-if="log.length">
                <Btn small @click="listing = !listing">{{ listing ? "Hide steps" : "What I did" }}</Btn>
            </template>
            <template v-if="done">
                <Btn small :disabled="busy" @click="act('discard')">Remove this board</Btn>
                <Btn kind="primary" small :disabled="busy" @click="act('keep')">Keep the board</Btn>
            </template>
            <template v-else>
                <Btn small :disabled="busy" title="Stops the agent and removes the board" @click="act('discard')">Cancel</Btn>
            </template>
        </div>
        <template v-if="listing">
            <ol class="build-strip-log">
                <template v-for="entry in log" :key="entry.at">
                    <li>{{ entry.text }}</li>
                </template>
            </ol>
        </template>
    </section>
</template>

<style scoped>
.build-strip {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 0 0 14px;
    padding: 10px 12px;
    border: 1px solid color-mix(in srgb, var(--accent) 45%, var(--border-2));
    border-radius: 11px;
    background: color-mix(in srgb, var(--accent) 7%, var(--raised));
}

.build-strip.done {
    border-color: color-mix(in srgb, var(--green, #63b37c) 35%, var(--border-2));
    background: color-mix(in srgb, var(--green, #63b37c) 5%, var(--raised));
}

.build-strip-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
}

.build-strip-words {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 5px;
    min-width: 0;
}

.build-strip-line {
    overflow: hidden;
    color: var(--text);
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.build-strip-meta {
    color: var(--text-4);
    font-size: 12px;
}

.build-strip-log {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 0;
    padding: 8px 0 2px 26px;
    border-top: 1px solid var(--border);
    color: var(--text-2);
    font-size: 12.5px;
    line-height: 1.45;
}

@media (max-width: 560px) {
    .build-strip-bar {
        flex-wrap: wrap;
    }

    .build-strip-words {
        flex-basis: calc(100% - 60px);
    }
}
</style>
