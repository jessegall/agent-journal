<script setup>
import {reactive, ref} from "vue";
import Btn from "../kit/Btn.vue";
import EmptyState from "../kit/EmptyState.vue";
import FoldGroup from "../kit/FoldGroup.vue";
import IconCount from "../kit/IconCount.vue";
import JournalTile from "../layout/JournalTile.vue";
import ListBox from "../kit/ListBox.vue";
import ListRow from "../kit/ListRow.vue";
import Monogram from "../kit/Monogram.vue";
import StatStrip from "../kit/StatStrip.vue";
import StatTile from "../kit/StatTile.vue";
import {projectPath, stoppedNote, useHub} from "../sync/hub.js";
import {remember, remembered} from "../composables/remembered.js";

const {loaded, running, online, stopped, needs, tally, refresh, forget} = useHub();
const opened = reactive(new Set(remembered("journal.hub.open", [])));
const showStopped = ref(remembered("journal.hub.stopped", false));

function toggle(j) {
    if (opened.has(j.root)) opened.delete(j.root);
    else opened.add(j.root);
    remember("journal.hub.open", [...opened]);
}

function toggleStopped() {
    showStopped.value = !showStopped.value;
    remember("journal.hub.stopped", showStopped.value);
}
</script>

<template>
    <section class="hub">
        <StatStrip>
            <StatTile
                flat
                label="Waiting on you"
                :value="tally.needs"
                :tone="tally.needs ? 'warn' : 'muted'"
                :note="tally.needs ? 'listed below' : 'nothing right now'"
            />
            <StatTile
                flat
                label="Agents working"
                :value="tally.working"
                :tone="tally.working ? 'progress' : 'muted'"
                :note="`of ${tally.agents} running`"
            />
            <StatTile flat label="Agents idle" :value="tally.idle" :tone="tally.idle ? '' : 'muted'" />
            <StatTile flat label="Open to-dos" :value="tally.todos" :tone="tally.todos ? '' : 'muted'" />
            <StatTile
                flat
                label="Journals running"
                :value="tally.journals"
                :note="tally.stopped ? `${tally.stopped} stopped` : 'none stopped'"
            />
        </StatStrip>

        <template v-if="needs.length">
            <ListBox title="Waiting on you" :count="tally.needs" tone="warn">
                <template v-for="item in needs" :key="item.key">
                    <ListRow :title="item.journal.project" :note="item.env.name">
                        <template #lead>
                            <Monogram :text="item.journal.project" :tint="item.journal.summary.color" :size="26" />
                        </template>
                        <template v-for="ask in item.asks" :key="ask.key">
                            <IconCount :icon="ask.icon" :count="ask.count" :label="ask.text" :href="ask.href" hot />
                        </template>
                    </ListRow>
                </template>
            </ListBox>
        </template>

        <template v-if="loaded && running.length < 2">
            <EmptyState class="hub-empty">
                Only this journal is running. Start another with
                <code>journal claude</code>
                in its project and it appears here.
            </EmptyState>
        </template>

        <TransitionGroup tag="div" name="hub-tile" class="hub-grid">
            <template v-for="j in online" :key="j.root">
                <JournalTile :journal="j" :open="opened.has(j.root)" @toggle="toggle(j)" @changed="refresh(j)" />
            </template>
        </TransitionGroup>

        <template v-if="stopped.length">
            <FoldGroup label="Stopped" :count="stopped.length" :open="showStopped" flush @toggle="toggleStopped">
                <ListBox class="hub-stopped">
                    <template v-for="j in stopped" :key="j.root">
                        <ListRow :title="j.project" :note="stoppedNote(j)" :text="`Start it with journal claude in ${projectPath(j)}`">
                            <template #lead>
                                <Monogram :text="j.project" :size="26" />
                            </template>
                            <template v-if="!j.running" #end>
                                <Btn small title="Take this journal off the hub until its viewer runs again" @click="forget(j)">Forget</Btn>
                            </template>
                        </ListRow>
                    </template>
                </ListBox>
            </FoldGroup>
        </template>
    </section>
</template>

<style scoped>
.hub {
    display: flex;
    flex-direction: column;
    gap: 22px;
    max-width: 1680px;
    padding: 22px 22px 48px;
}

.hub-empty code {
    color: var(--text-2);
}

.hub-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
    align-items: stretch;
    gap: 14px;
}

.hub-stopped {
    margin-top: 6px;
    opacity: 0.75;
}

.hub-tile-move {
    transition: transform 0.35s var(--ease);
}

@media (prefers-reduced-motion: reduce) {
    .hub-tile-move {
        transition: none;
    }
}

@media (max-width: 520px) {
    .hub {
        gap: 16px;
        padding: 16px 16px 40px;
    }
}
</style>
