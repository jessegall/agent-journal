<script setup>
import {onMounted, ref} from "vue";
import {api} from "../api/client.js";
import Dialog from "../kit/Dialog.vue";
import EmptyState from "../kit/EmptyState.vue";
import {peekRef} from "../route.js";
import {clock} from "../format/time.js";

const props = defineProps({plugin: {type: Object, required: true}});
const emit = defineEmits(["close"]);
const record = ref(null);

onMounted(async () => {
    record.value = (await api.pluginRecord(props.plugin.name)).record;
});

function open(line) {
    emit("close");
    peekRef(line.ref);
}
</script>

<template>
    <Dialog :title="`What ${plugin.title} did`" @close="emit('close')">
        <p class="record-lead">
            Its holds and lines to the agent, the commands it ran, its faults and everything it wrote in the journal, newest first. What it wrote outside the
            journal, straight to files or to the database, cannot be listed here.
        </p>
        <template v-if="record && !record.length">
            <EmptyState>It has done nothing in the journal yet.</EmptyState>
        </template>
        <ol class="record">
            <template v-for="(line, i) in record || []" :key="i">
                <li :class="['record-line', line.kind]">
                    <span class="record-at">{{ clock(line.at) }}</span>
                    <template v-if="line.ref">
                        <button type="button" class="record-text opens" @click="open(line)">{{ line.text }}</button>
                    </template>
                    <template v-else>
                        <span class="record-text">{{ line.text }}</span>
                    </template>
                </li>
            </template>
        </ol>
    </Dialog>
</template>

<style scoped>
.record-lead {
    margin: 0 0 12px;
    color: var(--text-3);
    font-size: 12.5px;
    line-height: 1.5;
}

.record {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.record-line {
    display: flex;
    align-items: baseline;
    gap: 12px;
    padding: 5px 0;
    border-bottom: 1px solid var(--border);
    font-size: 12.5px;
}

.record-at {
    flex: none;
    width: 64px;
    color: var(--text-4);
    font-variant-numeric: tabular-nums;
}

.record-text {
    color: var(--text-2);
    line-height: 1.5;
}

.record-line.fault .record-text {
    color: var(--danger);
}

.record-text.opens {
    padding: 0;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    text-align: left;
    text-decoration: underline;
    text-decoration-color: var(--border-3);
    cursor: pointer;
}
</style>
