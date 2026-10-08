<script setup>
import {othersLine} from "../domain/plans.js";
import {ref} from "vue";
import PlanList from "./PlanList.vue";

defineProps({plans: Array});
const opened = ref(false);
const button = ref(null);
</script>

<template>
    <template v-if="othersLine(plans)">
        <button ref="button" type="button" :class="['planmore', {on: opened}]" @click.stop="opened = !opened">
            {{ othersLine(plans) }}
        </button>
        <template v-if="opened">
            <PlanList :plans="plans" running :anchor="button" @close="opened = false" />
        </template>
    </template>
</template>

<style scoped>
.planmore {
    display: block;
    width: 100%;
    height: 24px;
    padding: 0 16px;
    border: 0;
    border-bottom: 1px solid var(--line);
    background: var(--bg-2);
    color: var(--text-3);
    font: inherit;
    font-size: 11.5px;
    text-align: left;
    cursor: pointer;
}

.planmore:hover,
.planmore.on {
    background: var(--hover);
    color: var(--text);
}
</style>
