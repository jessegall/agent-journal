<script setup>
import {ref, watch} from "vue";
import {api} from "../api/client.js";
import LinkCard from "../kit/LinkCard.vue";

const props = defineProps({agent: {type: Number, required: true}, session: {type: String, default: ""}});
const KINDS = [
    [/claude\.ai\/design\//, "Design"],
    [/claude\.ai\/(code\/)?artifact\//, "Page"],
    [/github\.com\/.+\/pull\//, "Pull request"],
    [/figma\.com\//, "Figma"],
];
const links = ref([]);
const kindOf = (href) => (KINDS.find(([pattern]) => pattern.test(href)) || [null, "Link"])[1];

watch(
    () => [props.agent, props.session],
    async () => {
        links.value = (await api.agentLinks(props.agent, props.session).catch(() => ({links: []}))).links;
    },
    {immediate: true}
);
</script>

<template>
    <template v-if="links.length">
        <div class="agent-links">
            <template v-for="href in links.slice(0, 3)" :key="href">
                <LinkCard :href="href" :kind="kindOf(href)" />
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
</style>
