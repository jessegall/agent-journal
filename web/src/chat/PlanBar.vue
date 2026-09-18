<script setup>
import {computed} from "vue";
import Icon from "../kit/Icon.vue";
import {go, route} from "../route.js";
import {rows} from "../store.js";

const plan = computed(() => rows("plan").find((p) => ["active", "waiting"].includes(p.data.status)) || null);
const phase = computed(() => (plan.value ? plan.value.data.phases[plan.value.data.current - 1] : null));
const done = computed(() =>
    plan.value
        ? plan.value.data.phases.filter(
              (p) => p.todos.length && p.todos.every((n) => (rows("todo").find((t) => t.n === n) || {}).completed)
          ).length
        : 0
);
</script>

<template>
    <button v-if="plan" type="button" class="planbar" @click="go(route.env, 'plan', plan.n)">
        <Icon name="flag" :size="14" />
        <span class="ptitle">{{ plan.title }}</span>
        <span class="phase">phase {{ plan.data.current }}, {{ phase ? phase.title : "" }}</span>
        <span v-if="plan.data.status === 'waiting'" class="wait">waiting for you at a checkpoint</span>
        <span class="grow" />
        <span class="progress">{{ done }}/{{ plan.data.phases.length }}</span>
    </button>
</template>

<style scoped>
.planbar {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 8px 22px;
    border: 0;
    border-bottom: 1px solid var(--border);
    background: var(--raised);
    color: var(--text-2);
    text-align: left;
    cursor: pointer;
}
.planbar:hover {
    background: var(--hover);
}
.ptitle {
    color: var(--text);
    font-weight: 500;
}
.wait {
    color: var(--warn);
}
.grow {
    flex: 1;
}
.progress {
    color: var(--text-3);
    font-size: 12px;
}
</style>
