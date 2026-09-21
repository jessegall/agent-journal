<script setup>
import {reactive} from "vue";
import JournalBar from "../layout/JournalBar.vue";
import {remember, remembered} from "../composables/remembered.js";
import {useHub} from "../sync/hub.js";

const {journals, loaded, running, refresh, forget} = useHub();
const opened = reactive(new Set(remembered("journal.hub", [])));

function toggle(j) {
    if (opened.has(j.root)) opened.delete(j.root);
    else opened.add(j.root);
    remember("journal.hub", [...opened]);
}
</script>

<template>
    <section class="hub">
        <div class="bar">
            <span class="count">
                {{ running.length }} {{ running.length === 1 ? "journal" : "journals" }} running on this machine{{
                    journals.length > running.length ? `, ${journals.length - running.length} stopped` : ""
                }}
            </span>
        </div>
        <template v-if="loaded && running.length < 2">
            <p class="empty">
                Only this journal is running. Start another with
                <code>journal claude</code>
                in its project and it appears here.
            </p>
        </template>
        <div class="bars">
            <template v-for="j in journals" :key="j.root">
                <template v-if="j.summary || j.unreadable || !j.running">
                    <JournalBar :journal="j" :open="opened.has(j.root)" @toggle="toggle(j)" @changed="refresh(j)" @forget="forget(j)" />
                </template>
            </template>
        </div>
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
    color: var(--text-3);
}

.empty code {
    color: var(--text-2);
}

.bars {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 18px 14px 0 22px;
}
</style>
