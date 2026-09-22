<script setup>
import EmptyState from "../kit/EmptyState.vue";
import {computed, reactive, ref} from "vue";
import Icon from "../kit/Icon.vue";
import JournalBar from "../layout/JournalBar.vue";
import {remember, remembered} from "../composables/remembered.js";
import {useHub} from "../sync/hub.js";

const {journals, loaded, running, refresh, forget} = useHub();
const opened = reactive(new Set(remembered("journal.hub.open", [])));
const showStopped = ref(remembered("journal.hub.stopped", false));

const busy = (j) => (j.summary?.environments || []).some((e) => e.agent && ["working", "compacting"].includes(e.agent.status));
const online = computed(() =>
    journals.value
        .filter((j) => j.running && !j.gone && (j.summary || j.unreadable))
        .sort((a, b) => busy(b) - busy(a) || a.project.localeCompare(b.project))
);
const stopped = computed(() => journals.value.filter((j) => !j.running || j.gone));

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
        <div class="bar">
            <span class="count">
                {{ running.length }} {{ running.length === 1 ? "journal" : "journals" }} running on this machine{{
                    stopped.length ? `, ${stopped.length} stopped` : ""
                }}
            </span>
        </div>
        <template v-if="loaded && running.length < 2">
            <EmptyState class="empty">
                Only this journal is running. Start another with
                <code>journal claude</code>
                in its project and it appears here.
            </EmptyState>
        </template>
        <div class="group">
            <h3 class="group-head">Running</h3>
            <div class="bars">
                <template v-for="j in online" :key="j.root">
                    <JournalBar :journal="j" :open="opened.has(j.root)" @toggle="toggle(j)" @changed="refresh(j)" @forget="forget(j)" />
                </template>
            </div>
        </div>
        <template v-if="stopped.length">
            <div class="group">
                <button type="button" class="group-head fold" :aria-expanded="showStopped" @click="toggleStopped">
                    <Icon name="chevron" :size="11" :class="['fold-icon', {open: showStopped}]" />
                    Stopped
                    <span class="group-count">{{ stopped.length }}</span>
                </button>
                <template v-if="showStopped">
                    <div class="bars">
                        <template v-for="j in stopped" :key="j.root">
                            <JournalBar :journal="j" :open="false" @forget="forget(j)" />
                        </template>
                    </div>
                </template>
            </div>
        </template>
    </section>
</template>

<style scoped>
.hub {
    padding: 0 0 40px;
}

.bar {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 44px;
    padding: 0 14px 0 22px;
    border-bottom: 1px solid var(--border);
    color: var(--text-2);
}

.empty {
    padding: 24px 22px;
}

.empty code {
    color: var(--text-2);
}

.group {
    padding: 18px 14px 0 22px;
}

.group-head {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0 0 10px;
    padding: 0;
    border: none;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 11.5px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.fold {
    cursor: pointer;
}

.fold:hover {
    color: var(--text-2);
}

.fold-icon {
    transition: transform 0.15s ease;
}

.fold-icon.open {
    transform: rotate(90deg);
}

.group-count {
    color: var(--text-3);
    font-weight: 400;
}

.bars {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>
