<script setup>
import {computed, reactive, ref, watch} from "vue";
import Btn from "../kit/Btn.vue";
import EmptyState from "../kit/EmptyState.vue";
import IconCount from "../kit/IconCount.vue";
import JournalTile from "../layout/JournalTile.vue";
import ListBox from "../kit/ListBox.vue";
import ListRow from "../kit/ListRow.vue";
import StatusLabel from "../kit/StatusLabel.vue";
import {projectPath, stoppedNote, useHub} from "../sync/hub.js";
import {counted} from "../format/number.js";
import {remember, remembered} from "../composables/remembered.js";
import {stopsOpen} from "../chat/agentStop.js";

const {loaded, running, online, stopped, needs, tally, refresh, forget} = useHub();
const opened = reactive(new Set(remembered("journal.hub.open", [])));
const stoppedFolded = ref(remembered("journal.hub.stopped.folded", false));
const hovering = ref(false);
const focused = ref(false);
const holding = computed(() => hovering.value || focused.value || stopsOpen.value > 0);
const order = ref([]);
watch([online, holding], () => !holding.value && (order.value = online.value.map((j) => j.root)), {immediate: true});
const tiles = computed(() => {
    const byRoot = new Map(online.value.map((j) => [j.root, j]));
    const kept = order.value.filter((root) => byRoot.has(root)).map((root) => byRoot.get(root));
    return [...kept, ...online.value.filter((j) => !order.value.includes(j.root))];
});

function toggle(j) {
    if (opened.has(j.root)) opened.delete(j.root);
    else opened.add(j.root);
    remember("journal.hub.open", [...opened]);
}

function toggleStopped() {
    stoppedFolded.value = !stoppedFolded.value;
    remember("journal.hub.stopped.folded", stoppedFolded.value);
}
</script>

<template>
    <section class="hub">
        <ListBox title="Journals" :count="online.length">
            <template #aside>
                <span class="hub-facts">
                    <StatusLabel :state="tally.working ? 'working' : 'idle'" :note="`${tally.idle} idle`">
                        {{ counted(tally.working, "agent working", "agents working") }}
                    </StatusLabel>
                    <IconCount icon="help" :count="tally.needs" label="waiting on you" :hot="tally.needs > 0" />
                    <IconCount icon="todos" :count="tally.todos" label="open to-dos" />
                </span>
            </template>
            <template v-if="loaded && running.length < 2">
                <EmptyState class="hub-empty">
                    Only this journal is running. Start another with
                    <code>journal claude</code>
                    in its project and it appears here.
                </EmptyState>
            </template>
            <TransitionGroup
                tag="div"
                name="hub-tile"
                class="hub-grid"
                @pointerenter="hovering = true"
                @pointerleave="hovering = false"
                @focusin="focused = true"
                @focusout="(e) => (focused = e.currentTarget.contains(e.relatedTarget))"
            >
                <template v-for="j in tiles" :key="j.root">
                    <JournalTile :journal="j" :open="opened.has(j.root)" @toggle="toggle(j)" @changed="refresh(j)" />
                </template>
            </TransitionGroup>
        </ListBox>

        <template v-if="needs.length">
            <ListBox title="Waiting on you" :count="tally.needs">
                <template v-for="item in needs" :key="item.key">
                    <ListRow :kind="`${item.journal.project} · ${item.env.name}`">
                        <template v-for="ask in item.asks" :key="ask.key">
                            <IconCount :icon="ask.icon" :count="ask.count" :label="ask.text" :href="ask.href" hot />
                        </template>
                    </ListRow>
                </template>
            </ListBox>
        </template>

        <template v-if="stopped.length">
            <ListBox title="Stopped" :count="stopped.length" folds :open="!stoppedFolded" @toggle="toggleStopped">
                <template v-for="j in stopped" :key="j.root">
                    <ListRow :kind="stoppedNote(j)" :title="j.project" :text="`Start it with journal claude in ${projectPath(j)}`">
                        <template v-if="!j.running" #end>
                            <Btn small title="Take this journal off the hub until its viewer runs again" @click="forget(j)">Forget</Btn>
                        </template>
                    </ListRow>
                </template>
            </ListBox>
        </template>
    </section>
</template>

<style scoped>
.hub-facts {
    display: inline-flex;
    align-items: center;
    gap: 18px;
    min-width: 0;
    margin-left: auto;
    overflow: hidden;
    letter-spacing: 0;
    white-space: nowrap;
}

.hub {
    display: flex;
    flex-direction: column;
    padding-bottom: 40px;
    overflow: hidden;
}

.hub-empty {
    padding: 18px 16px;
}

.hub-empty code {
    color: var(--text-2);
}

.hub .hub-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
    margin-right: -1px;
    border-bottom: 0;
}

.hub-tile-move {
    transition: transform 0.35s var(--ease);
}

@media (prefers-reduced-motion: reduce) {
    .hub-tile-move {
        transition: none;
    }
}
</style>
