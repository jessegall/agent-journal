import {ref, watch} from "vue";
import {api} from "../api/client.js";

const KINDS = [
    [/claude\.ai\/design\//, "Design"],
    [/claude\.ai\/(code\/)?artifact\//, "Page"],
    [/github\.com\/.+\/pull\//, "Pull request"],
    [/figma\.com\//, "Figma"],
];

export const kindOf = (href) => (KINDS.find(([pattern]) => pattern.test(href)) || [null, "Link"])[1];

export function useAgentLinks(source) {
    const links = ref([]);
    watch(
        source,
        async ([agent, session]) => {
            links.value = (await api.agentLinks(agent, session).catch(() => ({links: []}))).links;
        },
        {immediate: true}
    );
    return links;
}
