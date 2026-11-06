import {context} from "./windowContext.js";

const KEYS = {
    catalogue: {line: "skill list", events: ["setting.*"]},
    requirements: {line: "skill requirements", events: ["setting.*"]},
    "main-agent": {line: "agent main", events: ["agent.*"]},
    loaded: {line: "agent-skill list --limit 1000", events: ["agent_skill.*"], loading: "requested"},
    triggers: {line: "trigger list --skill", events: ["trigger.*"]},
    text: {line: "skill show", loading: "requested"},
    "agent-skill.*": {line: "agent-skill show {id}", loading: "requested"},
    trial: {line: "trigger try", loading: "requested"},
};

export const skillWindowContext = (answers) => context(answers, null, KEYS);
