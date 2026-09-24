<script setup>
import {computed} from "vue";
import LinkCard from "../kit/LinkCard.vue";
import {kindOf, standing, useAgentLinks} from "../composables/agentLinks.js";
import {rows} from "../sync/rows.js";

const props = defineProps({agent: {type: Number, required: true}, session: {type: String, default: ""}, compact: Boolean});
const links = useAgentLinks(() => [props.agent, props.session]);
const bare = (href) => href.split("?")[0];
const pinned = computed(() =>
    props.session ? rows("notice").filter((notice) => notice.data.agent === props.session && !notice.completed && notice.data.link) : []
);
const cards = computed(() => {
    const held = new Set(pinned.value.map((notice) => bare(notice.data.link)));
    const told = pinned.value.filter(standing).map((notice) => ({href: notice.data.link, label: notice.title}));
    const written = links.value.filter((href) => !held.has(bare(href))).map((href) => ({href, label: ""}));
    return props.compact ? [...told, ...written] : written.slice(0, 3);
});
</script>

<template>
    <template v-if="cards.length">
        <div :class="['agent-links', {compact}]">
            <template v-for="card in cards" :key="card.href">
                <LinkCard :href="card.href" :kind="kindOf(card.href)" :label="card.label" :compact="compact" />
            </template>
        </div>
    </template>
</template>

<style scoped>
.agent-links {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.agent-links.compact {
    flex-direction: row;
    gap: 8px;
    max-width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
    mask-image: linear-gradient(to right, #000 calc(100% - 28px), transparent);
}

.agent-links.compact > * {
    flex: none;
}
</style>
