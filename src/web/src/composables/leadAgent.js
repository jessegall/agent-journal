import {computed} from "vue";
import {leadOf} from "../domain/agents.js";
import {route} from "../route.js";
import {store} from "../state/store.js";

export const agent = computed(() => leadOf(store.agents));

export const agentOnline = computed(() => Boolean(agent.value) && store.live.some((live) => live.agent.session === agent.value.session && live.environment === route.value.env));

export const agentWorking = computed(() => Boolean(agent.value) && ["busy", "working"].includes(agent.value.status));
