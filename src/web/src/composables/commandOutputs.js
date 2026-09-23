import {ref} from "vue";
import {api} from "../api/client.js";
import {route} from "../route.js";
import {usePoll} from "../poll.js";
import {agent} from "../state/store.js";

const EVERY = 2000;

export function useCommandOutputs() {
    const outputs = ref({});
    usePoll(
        `outputs:${route.value.env}`,
        () => (agent.value ? api.outputs(agent.value.n) : Promise.resolve({outputs: {}})),
        EVERY,
        (got) => (outputs.value = got.outputs)
    );
    return outputs;
}
