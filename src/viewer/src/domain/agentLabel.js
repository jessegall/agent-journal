export const MAIN_AGENT_LABEL = "main agent";

// what an agent is called on a badge or a tip: a main agent is "main agent", with no number, any other agent its name
export const agentLabel = (name, main) => (main ? MAIN_AGENT_LABEL : name);
