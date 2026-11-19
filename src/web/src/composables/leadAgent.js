import {computed} from "vue";
import {leadOf} from "../domain/agents.js";
import {store} from "../state/store.js";

export const agent = computed(() => leadOf(store.agents));

export const agentWorking = computed(() => Boolean(agent.value) && ["busy", "working"].includes(agent.value.status));
