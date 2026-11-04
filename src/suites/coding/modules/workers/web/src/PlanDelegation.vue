<script setup>
import {computed, ref} from "vue";
import {WindowRoom, delegationWord, peekRef, useOutside, useWindow} from "@journal/window-kit";

// the plan being followed, as version 4's plan bar drew it: its title and, when agents work on it, a button naming the one agent or saying Delegated,
// which opens the agents on the plan with the task each has
const context = useWindow();
const plans = ref([]);
const open = ref(false);
const root = ref(null);
useOutside(root, () => (open.value = false));
const plan = computed(() => plans.value.find((one) => one.state === "started") ?? null);

async function load() {
    const answer = await context.read("plan board");
    plans.value = answer.ok ? answer.value.plans : [];
}

context.follow(["plan.*", "task.*"], load);
load();
</script>

<template>
    <WindowRoom>
        <template v-if="plan">
            <span ref="root" class="plan-bar" data-plan-bar>
                <span class="plan-bar-badge" data-plan-bar-badge>Active</span>
                <button type="button" class="plan-bar-title" :title="plan.title" data-plan-bar-title @click="peekRef(`plans:${plan.id}`)">Plan {{ plan.id }}: {{ plan.title }}</button>
                <template v-if="plan.delegated">
                    <button type="button" class="plan-bar-delegation" :aria-expanded="open" data-plan-bar-delegation @click.stop="open = !open">{{ delegationWord(plan) }}</button>
                    <template v-if="open">
                        <div class="plan-bar-popover" role="dialog" aria-label="Agents on this plan" data-plan-bar-popover>
                            <p class="plan-bar-head">Agents on this plan</p>
                            <template v-for="agent in plan.agents" :key="`${agent.id}:${agent.task_id}`">
                                <button type="button" class="plan-bar-agent" data-plan-bar-agent @click="peekRef(`agents:${agent.id}`)">
                                    <strong>{{ agent.name }}</strong>
                                    <span>task {{ agent.task_id }}: {{ agent.task_title }}</span>
                                </button>
                            </template>
                        </div>
                    </template>
                </template>
            </span>
        </template>
    </WindowRoom>
</template>

<style scoped>
.plan-bar {
    position: relative;
    display: inline-flex;
    gap: 8px;
    align-items: center;
    font-size: 12.5px;
}

.plan-bar-badge {
    padding: 0 7px;
    border: 1px solid var(--border-2);
    border-radius: 99px;
    color: var(--progress);
    font-size: 11px;
    line-height: 18px;
}

.plan-bar-title,
.plan-bar-delegation,
.plan-bar-agent {
    border: 0;
    background: none;
    color: var(--text-2);
    font: inherit;
    cursor: pointer;
}

.plan-bar-title {
    max-width: 260px;
    padding: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.plan-bar-delegation {
    padding: 0 8px;
    border: 1px solid var(--border-2);
    border-radius: 99px;
    line-height: 20px;
}

.plan-bar-popover {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    z-index: 5;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 260px;
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--raised);
    box-shadow: 0 8px 24px rgb(0 0 0 / 0.25);
}

.plan-bar-head {
    margin: 0 0 4px;
    color: var(--text-3);
    font-size: 11.5px;
}

.plan-bar-agent {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 2px 0;
    text-align: left;
}

.plan-bar-agent span {
    color: var(--text-3);
    font-size: 12px;
}
</style>
