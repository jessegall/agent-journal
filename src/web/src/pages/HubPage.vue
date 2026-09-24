<script setup>
import {reactive, ref} from "vue";
import Btn from "../kit/Btn.vue";
import EmptyState from "../kit/EmptyState.vue";
import FactBar from "../kit/FactBar.vue";
import IconCount from "../kit/IconCount.vue";
import JournalTile from "../layout/JournalTile.vue";
import ListBox from "../kit/ListBox.vue";
import ListRow from "../kit/ListRow.vue";
import StatusLabel from "../kit/StatusLabel.vue";
import {counted, projectPath, stoppedNote, useHub} from "../sync/hub.js";
import {remember, remembered} from "../composables/remembered.js";

const {loaded, running, online, stopped, needs, tally, refresh, forget} = useHub();
const opened = reactive(new Set(remembered("journal.hub.open", [])));
const stoppedFolded = ref(remembered("journal.hub.stopped.folded", false));

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
        <FactBar>
            <StatusLabel :state="tally.working ? 'working' : 'idle'" :note="`${tally.idle} idle`">
                {{ counted(tally.working, "agent working", "agents working") }}
            </StatusLabel>
            <IconCount icon="help" :count="tally.needs" label="waiting on you" :hot="tally.needs > 0" />
            <IconCount icon="todos" :count="tally.todos" label="open to-dos" />
            <IconCount
                icon="folder"
                :count="tally.journals"
                :label="`${tally.journals === 1 ? 'journal' : 'journals'} running · ${tally.stopped} stopped`"
            />
        </FactBar>

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

        <ListBox title="Journals" :count="online.length">
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
        </ListBox>

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
