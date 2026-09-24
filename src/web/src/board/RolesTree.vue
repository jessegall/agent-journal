<script setup>
import {computed, reactive} from "vue";
import FoldGroup from "../kit/FoldGroup.vue";
import Spinner from "../kit/Spinner.vue";
import {peek} from "../route.js";

const props = defineProps({roles: {type: Array, default: () => []}});
const shut = reactive(new Set());
const opened = reactive(new Set());
const domains = computed(() => {
    const grouped = [];
    for (const role of props.roles) {
        if (grouped.at(-1)?.name !== role.domain) grouped.push({name: role.domain, title: role.domain_title, roles: []});
        grouped.at(-1).roles.push(role);
    }
    return grouped.map((domain) => ({...domain, working: domain.roles.reduce((sum, role) => sum + role.tickets.length, 0)}));
});
const flip = (set, key) => (set.has(key) ? set.delete(key) : set.add(key));
</script>

<template>
    <section class="roles-tree" aria-label="Domains and roles">
        <template v-for="domain in domains" :key="domain.name">
            <FoldGroup
                :label="domain.title"
                :count="domain.working || ''"
                :open="!shut.has(domain.name)"
                flush
                @toggle="flip(shut, domain.name)"
            >
                <template v-for="role in domain.roles" :key="role.name">
                    <button
                        type="button"
                        :class="['role', {busy: role.tickets.length}]"
                        :disabled="!role.tickets.length"
                        @click="flip(opened, role.name)"
                    >
                        <span class="role-title">{{ role.title }}</span>
                        <template v-if="role.tickets.length">
                            <Spinner />
                            <span class="role-count">{{ role.tickets.length }} working</span>
                        </template>
                        <template v-else>
                            <span class="role-count">idle</span>
                        </template>
                    </button>
                    <template v-if="opened.has(role.name)">
                        <template v-for="ticket in role.tickets" :key="`${role.name}-${ticket.n}`">
                            <button type="button" class="role-ticket" @click="peek('ticket', ticket.n)">
                                #{{ ticket.n }} {{ ticket.title }}
                            </button>
                        </template>
                    </template>
                </template>
            </FoldGroup>
        </template>
    </section>
</template>

<style scoped>
.roles-tree {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 22px;
    padding: 6px 2px 10px;
}

.roles-tree > * {
    min-width: 200px;
}

.role {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12.5px;
    text-align: left;
    cursor: default;
}

.role.busy {
    color: var(--text);
    cursor: pointer;
}

.role.busy:hover {
    background: var(--hover);
}

.role-title {
    flex: 1;
}

.role-count {
    color: var(--text-3);
    font-size: 11.5px;
}

.role-ticket {
    padding: 3px 8px 3px 22px;
    border: 0;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12px;
    text-align: left;
    cursor: pointer;
}

.role-ticket:hover {
    color: var(--accent-text);
}
</style>
