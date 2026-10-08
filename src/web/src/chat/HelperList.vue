<script setup>
import {helperCard, helperCounts, helperEnvironment, helperName, helpersByState} from "../domain/helpers.js";
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import CloseButton from "../kit/CloseButton.vue";
import FoldGroup from "../kit/FoldGroup.vue";
import TicketAgent from "../agents/TicketAgent.vue";
import HelperRow from "./HelperRow.vue";
import Skeleton from "../kit/Skeleton.vue";

const props = defineProps({rows: {type: Array, default: () => []}, loading: Boolean});
const emit = defineEmits(["changed", "close"]);
const grouped = computed(() => helpersByState(props.rows));
const counts = computed(() => helperCounts(props.rows));
const countsLine = computed(() =>
    [counts.value.working && `${counts.value.working} working`, counts.value.reported && `${counts.value.reported} with reports`]
        .filter(Boolean)
        .join(" · ")
);
const closedOpen = ref(false);
const inspected = ref(null);
</script>

<template>
    <div class="helpers">
        <header class="helpers-head">
            <div>
                <h4 class="helpers-heading">Helpers</h4>
                <span class="helpers-counts">{{ countsLine }}</span>
            </div>
            <CloseButton @click="emit('close')" />
        </header>
        <div class="helpers-body">
            <template v-if="!rows.length && loading">
                <Skeleton :count="3" label="Loading the helpers" />
            </template>
            <template v-else-if="!rows.length">
                <p class="helpers-none">No helpers have been started here.</p>
            </template>
            <template v-for="row in grouped.open" :key="row.n">
                <HelperRow :row="row" @changed="emit('changed')" @inspect="inspected = row" />
            </template>
            <template v-if="grouped.closed.length">
                <FoldGroup flush label="Closed" :count="grouped.closed.length" :open="closedOpen" @toggle="closedOpen = !closedOpen">
                    <template v-for="row in grouped.closed" :key="row.n">
                        <HelperRow :row="row" @changed="emit('changed')" @inspect="inspected = row" />
                    </template>
                </FoldGroup>
            </template>
        </div>
        <template v-if="inspected">
            <TicketAgent
                :card="helperCard(inspected)"
                :env="helperEnvironment(inspected)"
                kind="helper"
                :label="helperName(inspected)"
                @close="inspected = null"
                @stopped="emit('changed')"
            />
        </template>
    </div>
</template>

<style scoped>
.helpers {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
}

.helpers-head {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 2px 2px 8px 8px;
    border-bottom: 1px solid var(--line);
}

.helpers-heading {
    margin: 0;
    color: var(--text);
    font-size: 13px;
    font-weight: 600;
}

.helpers-counts {
    margin-left: 8px;
    color: var(--text-3);
    font-size: 12px;
}

.helpers-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding-top: 4px;
}

.helpers-none {
    margin: 8px;
    color: var(--text-3);
    font-size: 12px;
}
</style>
