<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {pollKey, usePoll} from "../composables/poll.js";
import {dockedDump, dumpCollection} from "../domain/docks.js";
import {PHASE_WORDS} from "../domain/dumpPile.js";
import DockRow from "./kit/DockRow.vue";
import {toast} from "./kit/toast.js";

const DUMPS_EVERY = 10000;
const DUMPS_KEPT = 5;

const emit = defineEmits(["open"]);
const dumps = ref([]);
const refresh = usePoll(
    pollKey(),
    () => api.list("dump", {last: DUMPS_KEPT, completed: true}),
    DUMPS_EVERY,
    (got) => (dumps.value = got.rows)
);
const filing = computed(() => dumps.value.filter((d) => !d.deleted && !d.completed).sort((a, b) => a.n - b.n)[0] || null);
const filed = computed(() => dockedDump(dumps.value));

function openFiled() {
    const n = dumpCollection(filed.value);
    emit("open", n ? `collection:${n}` : `dump:${filed.value.n}`);
}

async function hide() {
    try {
        await api.act("dump", filed.value.n, "dismiss");
        refresh();
    } catch (error) {
        toast(error.message);
    }
}
</script>

<template>
    <template v-if="filing">
        <DockRow
            :title="filing.title"
            :label="PHASE_WORDS.filing"
            :spoken="`${filing.title}, filing. Open it`"
            @open="emit('open', `dump:${filing.n}`)"
        />
    </template>
    <template v-else-if="filed">
        <DockRow
            :title="`${filed.title} filed`"
            label="Open the collection"
            tone="quiet"
            close-label="Hide from the chat; its collection stays"
            @open="openFiled"
            @close="hide"
        />
    </template>
</template>
