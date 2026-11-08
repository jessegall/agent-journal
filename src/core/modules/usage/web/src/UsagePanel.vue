<script setup>
import {computed, ref} from "vue";
import {Btn, WindowRoom, useWindow} from "@journal/window-kit";

// the plan allowance as version 4's usage menu drew it: a meter for each window of the plan, with when it starts again;
// a window used up in full says the agents wait at the usage limit until then
const view = useWindow();
const {data: usage, failure} = view.props.usage;
const windows = computed(() => usage.value?.windows ?? []);
// the limits a person sets on the allowance: each counts a window of the plan, fixed or as a budget from now
const limits = computed(() => view.props.limits?.rows?.value ?? []);
const program = computed(() => usage.value?.agents?.[0]?.program ?? "claude");
const kind = ref("5 hours");
const mode = ref("fixed");
const percent = ref(50);
const limitFailure = ref("");

async function setLimit() {
    const number = Number(percent.value);
    if (view.readOnly || !(number > 0 && number <= 100)) { limitFailure.value = "Use a percent from 1 to 100."; return; }
    const answer = await view.run(["usage-limit", "set", program.value, kind.value, mode.value, String(number)]);
    limitFailure.value = answer.ok ? "" : answer.error;
    if (answer.ok) await view.reload("limits");
}

async function removeLimit(limit) {
    const answer = await view.run(["usage-limit", "delete", String(limit.id)]);
    limitFailure.value = answer.ok ? "" : answer.error;
    if (answer.ok) await view.reload("limits");
}

const describe = (limit) => `${limit.window}: ${limit.mode === "fixed" ? "halt at" : "halt after"} ${limit.percent}%${limit.mode === "fixed" ? "" : " more than when it was set"}`;

const reset = (seconds) => `Starts again ${new Date(seconds * 1000).toLocaleString()}`;
</script>

<template>
    <WindowRoom padding="14px 16px">
        <p class="current">Plan allowance used</p>
        <template v-if="failure">
            <p class="none">{{ failure }}</p>
        </template>
        <template v-for="plan in windows" :key="plan.title">
            <div class="meter" data-usage-meter>
                <span>{{ plan.title }}</span>
                <strong>{{ Math.round(plan.used_percent) }}%</strong>
                <span class="track"><span :style="{width: `${plan.used_percent}%`}" /></span>
                <small>{{ plan.used_percent >= 100 ? `At the usage limit. ${reset(plan.reset_epoch_seconds)}` : reset(plan.reset_epoch_seconds) }}</small>
            </div>
        </template>
        <div class="limit-form" data-usage-limit-form>
            <p class="current">Stop the agents at your own limit</p>
            <select v-model="kind" aria-label="Window the limit counts"><option>5 hours</option><option>7 days</option><option>hour</option></select>
            <select v-model="mode" aria-label="Type of limit"><option value="fixed">halt at</option><option value="budget">halt after more than</option></select>
            <input v-model="percent" type="number" min="1" max="100" aria-label="Percent of the window">
            <Btn small @click="setLimit">Set limit</Btn>
            <template v-if="limitFailure">
              <p class="none" data-usage-limit-failure>{{ limitFailure }}</p>
            </template>
        </div>
        <template v-for="limit in limits" :key="limit.id">
          <div class="meter" data-usage-limit>
              <span>{{ describe(limit) }}</span>
              <Btn small @click="removeLimit(limit)">Remove</Btn>
          </div>
        </template>
        <template v-if="usage && !windows.length">
            <p class="none">No current plan window has been reported here.</p>
        </template>
    </WindowRoom>
</template>

<style scoped>
.current {
    margin: 0;
    padding: 2px 0 6px;
    color: var(--text);
    font-size: 12px;
}

.meter {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 4px 8px;
    padding: 6px 0;
    color: var(--text-2);
    font-size: 11.5px;
}

.meter strong {
    color: var(--text);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
}

.track {
    grid-column: 1 / -1;
    height: 4px;
    overflow: hidden;
    border-radius: 2px;
    background: var(--line);
}

.track > span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: var(--accent-text);
}

.meter small {
    grid-column: 1 / -1;
    color: var(--text-3);
    font-size: 10.5px;
}

.limit-form {
    display: grid;
    grid-template-columns: 1fr 1fr 5em auto;
    gap: 6px;
    padding: 8px 0;
}

.limit-form .current {
    grid-column: 1 / -1;
    padding: 0;
}

.none {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
