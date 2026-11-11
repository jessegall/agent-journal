<script setup>
import {computed, onMounted, ref} from "vue";
import {Btn, EmptyState, FoldGroup, Skeleton, useWindow} from "@journal/window-kit";
import MemoryRow from "./MemoryRow.vue";

// the memories of one agent, read through the memory page: the ones in force first, heaviest first, and the removed ones folded under them
const props = defineProps({agent: {type: Number, required: true}});
const view = useWindow();
const activeName = `agent-memories.${props.agent}`;
const removedName = `agent-removed-memories.${props.agent}`;
const active = view.props[activeName];
const removed = view.props[removedName];
const removedOpen = ref(false);
const loaded = computed(() => active.loaded.value && removed.loaded.value);
const failure = computed(() => active.failure.value || removed.failure.value);
const countOf = (read) => read.listing.value?.total ?? read.rows.value.length;
const read = () => view.reload([activeName, removedName]);
onMounted(read);
</script>

<template>
    <section class="agent-memories" data-agent-memories>
        <template v-if="!loaded">
            <Skeleton />
        </template>
        <template v-else-if="failure">
            <div class="notice" role="alert" data-agent-memories-failure>
                <span>Could not read the memories of this agent: the journal did not answer.</span>
                <Btn small bordered data-agent-memories-retry @click="read">Try again</Btn>
            </div>
        </template>
        <template v-else-if="!active.rows.value.length && !removed.rows.value.length">
            <EmptyState title="No memories">This agent has not made any, and none were given to it.</EmptyState>
        </template>
        <template v-else>
            <template v-if="active.rows.value.length">
                <p class="band" data-agent-memories-active>Active: {{ countOf(active) }}</p>
                <template v-for="row in active.rows.value" :key="row.id">
                    <MemoryRow class="row" :row="row" />
                </template>
            </template>
            <template v-if="removed.rows.value.length">
                <FoldGroup :label="`Removed: ${countOf(removed)}`" :open="removedOpen" data-agent-memories-removed @toggle="removedOpen = !removedOpen">
                    <template v-for="row in removed.rows.value" :key="row.id">
                        <MemoryRow class="row" :row="row" />
                    </template>
                </FoldGroup>
            </template>
        </template>
    </section>
</template>

<style scoped>
.agent-memories { display: flex; flex-direction: column; min-width: 0; }
.band { margin: 0; padding: 8px 14px 4px; color: var(--text-3); font-size: 12px; }
.agent-memories .row { padding: 8px 14px; }
.notice { display: flex; flex-wrap: wrap; gap: 8px 12px; align-items: center; margin: 12px 14px; padding: 8px 11px; border: 1px solid var(--border-2); border-radius: 7px; color: var(--danger); font-size: 12.5px; }
</style>
