<script setup>
import {computed} from "vue";
import EmptyState from "../kit/EmptyState.vue";
import ListRow from "../kit/ListRow.vue";
import {age} from "../format/time.js";

const props = defineProps({view: {type: Object, required: true}, ends: {type: String, default: ""}});
const agents = computed(() => props.view.kind === "agents");
const heading = computed(() => (agents.value ? "Agents" : "Chat"));
const empty = computed(() => (agents.value ? "No agent is running right now." : "No messages yet."));
const who = (line) => (line.author === "user" ? "User" : "Agent");
</script>

<template>
    <main class="share-view">
        <h1>{{ heading }}</h1>
        <template v-if="!view.lines.length">
            <EmptyState>{{ empty }}</EmptyState>
        </template>
        <template v-else-if="agents">
            <template v-for="line in view.lines" :key="line.name">
                <ListRow :kind="line.state" :title="line.name" :text="line.work || 'Nothing in hand'" />
            </template>
        </template>
        <template v-else>
            <template v-for="line in view.lines" :key="line.at">
                <ListRow :kind="who(line)" :text="line.text">
                    <template #end>{{ age(line.at) }}</template>
                </ListRow>
            </template>
        </template>
        <footer class="foot">
            Shared from an agent journal, read only
            <template v-if="ends">· This link ends {{ ends }}</template>
        </footer>
    </main>
</template>

<style scoped>
.share-view {
    max-width: 720px;
    margin: 0 auto;
    padding: 24px 16px;
}

h1 {
    margin: 0 0 16px;
    font-size: 20px;
}

.foot {
    margin-top: 24px;
    font-size: 12px;
    color: var(--text-3);
}
</style>
