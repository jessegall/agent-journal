<script setup>
import {ago} from "../format/time.js";
import Btn from "../kit/Btn.vue";
import Notice from "../kit/Notice.vue";

defineProps({
    sequence: {type: Object, required: true},
    history: {type: Array, default: () => []},
    busy: {type: String, default: ""},
});
const emit = defineEmits(["skip", "end"]);
</script>

<template>
    <Notice tone="info">
        <span class="sequence-band">
            <span class="sequence-label">
                Sequence {{ sequence.n }}, {{ sequence.title }}: step {{ sequence.step }} of {{ sequence.steps }}
                <template v-if="sequence.about">· about {{ sequence.about }}</template>
            </span>
            <span class="sequence-step">{{ sequence.text }}</span>
            <span class="sequence-holds">{{ sequence.holds }}</span>
            <template v-if="sequence.under">
                <span class="sequence-holds">
                    Started inside {{ sequence.under === 1 ? "another sequence" : `${sequence.under} other sequences` }}, which goes on when
                    this one ends.
                </span>
            </template>
            <template v-if="history.length">
                <span class="sequence-label sequence-history-label">Recent</span>
                <ul class="sequence-history">
                    <li v-for="change in history" :key="`${change.at}${change.text}`">
                        <span class="sequence-when">{{ ago(change.at) }}</span>
                        {{ change.text }}
                    </li>
                </ul>
            </template>
        </span>
        <template #actions>
            <Btn small :busy="busy === 'skip'" title="Pass over this step; the agent is told and given the next one" @click="emit('skip')">
                Skip step
            </Btn>
            <Btn
                small
                kind="danger"
                :busy="busy === 'end'"
                title="End the sequence where it stands; the agent is told"
                @click="emit('end')"
            >
                End sequence
            </Btn>
        </template>
    </Notice>
</template>

<style scoped>
.sequence-band {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
}

.sequence-label {
    color: var(--text-3);
    font-size: 11px;
    font-weight: 600;
}

.sequence-step {
    color: var(--text-1);
}

.sequence-holds {
    color: var(--text-2);
    font-size: 12px;
}

.sequence-history-label {
    margin-top: 4px;
}

.sequence-history {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 0;
    padding: 0;
    list-style: none;
    color: var(--text-2);
    font-size: 12px;
}

.sequence-when {
    margin-right: 6px;
    color: var(--text-3);
}
</style>
