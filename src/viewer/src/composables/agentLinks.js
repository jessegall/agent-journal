import {ref, watch} from "vue";

export function useAgentLinks(api, source) {
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
