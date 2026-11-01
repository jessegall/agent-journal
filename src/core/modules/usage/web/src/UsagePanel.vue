<script setup>
import {onUnmounted, ref} from "vue";
import {RowList, useRows, useWindow} from "@journal/window-kit";

const context = useWindow();
const usage = ref(null);
const failure = ref("");
const counts = useRows("statistic list", []);

async function load() {
    const result = await context.read("usage show");
    usage.value = result.ok ? result.value : null;
    failure.value = result.ok ? "" : result.error;
}

const dollars = (amount) => `$${Number(amount || 0).toFixed(2)}`;
const reset = (seconds) => new Date(seconds * 1000).toLocaleString();

const REFRESH_MILLISECONDS = 30000;
const timer = setInterval(load, REFRESH_MILLISECONDS);
onUnmounted(() => clearInterval(timer));
load();
</script>

<template>
    <template v-if="failure">
        <p class="failure">{{ failure }}</p>
    </template>
    <template v-if="usage">
        <h3 class="heading">Sessions</h3>
        <RowList :rows="usage.agents" :failure="''" :loaded="true" empty="No open sessions">
            <template #default="{row}">
                <div class="line">
                    <span class="title">{{ row.session }}</span>
                    <span class="detail">{{ row.model || "Nothing reported yet" }}</span>
                    <template v-if="row.context_percent !== null">
                        <span class="detail">Context {{ row.context_percent }}%</span>
                    </template>
                    <span class="detail">{{ dollars(row.cost_dollars) }}</span>
                </div>
            </template>
        </RowList>
        <p class="total">Cost of the open sessions: {{ dollars(usage.cost_dollars) }}</p>
        <h3 class="heading">Plan</h3>
        <RowList :rows="usage.windows" :failure="''" :loaded="true" empty="No limits reported yet">
            <template #default="{row}">
                <div class="line">
                    <span class="title">{{ row.title }}</span>
                    <span class="detail">{{ Math.round(row.used_percent) }}% used</span>
                    <span class="detail">Starts again {{ reset(row.reset_epoch_seconds) }}</span>
                </div>
            </template>
        </RowList>
    </template>
    <h3 class="heading">Counts</h3>
    <RowList :rows="counts.rows.value" :failure="counts.failure.value" :loaded="counts.loaded.value" empty="No counts yet">
        <template #default="{row}">
            <div class="line">
                <span class="title">{{ row.key }}</span>
                <span class="detail">{{ row.value }}</span>
            </div>
        </template>
    </RowList>
</template>

<style scoped>
.failure {
    margin: 0 0 8px;
    color: var(--bad, var(--text-2));
    font-size: 12px;
}

.heading {
    margin: 12px 0 6px;
    color: var(--text-3);
    font-size: 12px;
    font-weight: 600;
}

.line {
    display: flex;
    flex: 1;
    align-items: baseline;
    gap: 10px;
    font-size: 13px;
}

.title {
    flex: 1;
}

.detail,
.total {
    color: var(--text-3);
    font-size: 12px;
}
</style>
