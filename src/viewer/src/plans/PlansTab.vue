<script setup>
import {computed, ref} from "vue";
import {usePlanRows} from "../composables/planRows.js";
import {planGroups} from "../domain/plans.js";
import {rows} from "../sync/rows.js";
import PlanRunCard from "./PlanRunCard.vue";
import PlanWaitRow from "./PlanWaitRow.vue";

// The Home page's Plans window: the open plans, those being worked on as cards of their own, then those waiting to start as quiet rows, each with its progress.
const groups = computed(() => planGroups(rows("plans")));
const error = ref("");
usePlanRows(() => groups.value.flatMap((group) => group.plans));
</script>

<template>
    <div class="plans-tab">
        <template v-if="!groups.length">
            <div class="plans-empty">
                <svg viewBox="0 0 40 40">
                    <rect x="6" y="9" width="14" height="5" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.4" />
                    <rect x="11" y="17.5" width="16" height="5" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.4" />
                    <rect x="16" y="26" width="18" height="5" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2.2 2.4" />
                    <path d="M8.5 14v6h2.5M13.5 22.5v6h2.5" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" opacity=".6" />
                </svg>
                <h4>No open plans</h4>
                <p>A plan is listed here from when the agent writes it until it is closed.</p>
            </div>
        </template>
        <template v-if="error">
            <p class="plans-error">{{ error }}</p>
        </template>
        <template v-for="group in groups" :key="group.key">
            <section class="plans-group">
                <h4 class="plans-head">
                    {{ group.title }} <span class="plans-count">{{ group.plans.length }}</span>
                </h4>
                <template v-for="p in group.plans" :key="p.id">
                    <template v-if="group.key === 'running'">
                        <PlanRunCard :plan="p" @failed="error = $event" />
                    </template>
                    <template v-else>
                        <PlanWaitRow :plan="p" @failed="error = $event" />
                    </template>
                </template>
            </section>
        </template>
    </div>
</template>

<style scoped>
.plans-tab {
    container-type: inline-size;
    position: relative;
    height: 100%;
    overflow: auto;
    padding: 6px 0 14px;
}

.plans-group + .plans-group {
    margin-top: 6px;
}

.plans-head {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 8px 24px;
    color: var(--text-3);
    font-size: 12px;
    font-weight: 500;
}

.plans-count {
    color: var(--text-4);
    font-variant-numeric: tabular-nums;
}

.plans-error {
    margin: 4px 24px;
    color: var(--danger);
    font-size: 12px;
}

.plans-empty {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 28px;
    text-align: center;
}

.plans-empty svg {
    width: 48px;
    height: 48px;
    margin-bottom: 6px;
    color: var(--text-4);
}

.plans-empty h4 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
}

.plans-empty p {
    max-width: 260px;
    margin: 0;
    color: var(--text-3);
    font-size: 12.5px;
}
</style>
