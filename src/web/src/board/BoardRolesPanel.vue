<script setup>
import {ui} from "../state/ui.js";
import {href} from "../route.js";
import FoldGroup from "../kit/FoldGroup.vue";
import {useToggledSet} from "../composables/toggledSet.js";

defineProps({working: {type: Array, required: true}, domains: {type: Array, required: true}, organization: {type: String, required: true}});
const {members: flipped, toggle} = useToggledSet();
const open = (domain) => flipped.value.has(domain.name) !== !!domain.working;
const light = (n) => (ui.litCard = n);
</script>

<template>
    <div class="board-roles-panel">
        <template v-if="working.length">
            <span class="board-roles-heading">Working now</span>
            <template v-for="chip in working" :key="chip.key">
                <div class="board-roles-work" @mouseenter="light(chip.n)" @mouseleave="light(0)">
                    <span class="board-roles-work-title">{{ chip.title }}</span>
                    <span class="board-roles-cards">#{{ chip.n }}</span>
                    <template v-if="chip.env">
                        <a :href="href.page(chip.env)">Open chat</a>
                    </template>
                </div>
            </template>
        </template>
        <span class="board-roles-heading">All roles</span>
        <template v-for="domain in domains" :key="domain.name">
            <FoldGroup
                :label="domain.title"
                :count="domain.working ? `${domain.working} working` : ''"
                :open="open(domain)"
                flush
                @toggle="toggle(domain.name)"
            >
                <template v-for="role in domain.roles" :key="role.name">
                    <span :class="['board-roles-role', {busy: role.busy}]">
                        {{ role.title }}
                        <span class="board-roles-cards">{{ role.cards }}</span>
                    </span>
                </template>
            </FoldGroup>
        </template>
        <a class="board-roles-organization" :href="organization">Open the Organization page</a>
    </div>
</template>

<style scoped>
.board-roles-panel {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 10px 12px;
}

.board-roles-heading {
    margin-top: 4px;
    color: var(--text-3);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.03em;
    text-transform: uppercase;
}

.board-roles-work {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 3px 0;
    font-size: 12.5px;
}

.board-roles-work-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.board-roles-cards {
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
}

.board-roles-work a,
.board-roles-organization {
    color: var(--accent-text);
    font-size: 12px;
    text-decoration: none;
}

.board-roles-work a:hover,
.board-roles-organization:hover {
    text-decoration: underline;
}

.board-roles-role {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 3px 8px;
    color: var(--text-3);
    font-size: 12.5px;
}

.board-roles-role.busy {
    color: var(--text);
}

.board-roles-organization {
    margin-top: 6px;
    padding-top: 8px;
    border-top: 1px solid var(--border);
}
</style>
