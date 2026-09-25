<script setup>
import Chip from "../kit/Chip.vue";

defineProps({role: Object, lead: Boolean});
const CARDINALITY = {worktree: "one per ticket", plural: "any number at once", plan: "one for a whole plan"};
</script>

<template>
    <article class="role">
        <header class="top">
            <span class="title">{{ role.title || role.name }}</span>
            <template v-if="lead">
                <Chip>Leads the domain</Chip>
            </template>
        </header>
        <template v-if="role.description">
            <p class="description">{{ role.description }}</p>
        </template>
        <dl class="facts">
            <template v-if="role.responsible">
                <dt>Does</dt>
                <dd>{{ role.responsible }}</dd>
            </template>
            <template v-if="role.not_responsible">
                <dt>Leaves to others</dt>
                <dd>{{ role.not_responsible }}</dd>
            </template>
            <template v-if="role.inputs.length">
                <dt>Needs</dt>
                <dd>{{ role.inputs.join(", ") }}</dd>
            </template>
            <template v-if="role.outputs.length">
                <dt>Hands back</dt>
                <dd>{{ role.outputs.join(", ") }}</dd>
            </template>
            <template v-if="role.skills.length">
                <dt>Skills</dt>
                <dd>{{ role.skills.join(", ") }}</dd>
            </template>
            <template v-if="role.tools.length">
                <dt>Tools</dt>
                <dd>{{ role.tools.join(", ") }}</dd>
            </template>
        </dl>
        <footer class="meta">
            <span>{{ CARDINALITY[role.cardinality] || role.cardinality }}</span>
            <template v-if="role.model">
                <span>· {{ role.model }}</span>
            </template>
        </footer>
    </article>
</template>

<style scoped>
.role {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--raised);
}

.top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

.title {
    font-size: 13.5px;
    font-weight: 500;
}

.description {
    margin: 0;
    color: var(--text-2);
    font-size: 13px;
    line-height: 1.5;
}

.facts {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 4px 12px;
    margin: 0;
    font-size: 12.5px;
}

.facts dt {
    color: var(--text-3);
}

.facts dd {
    margin: 0;
    color: var(--text-2);
}

.meta {
    display: flex;
    gap: 6px;
    color: var(--text-4);
    font-size: 12px;
}
</style>
