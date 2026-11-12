const MAIN_ROLE = "main";
const MAIN_NAME = "Main agent";
const ROLE_TITLES = {main: MAIN_NAME, worker: "Worker", helper: "Helper"};
const PROFILE_PREFIX = "journal-";

const capital = (word) => word.slice(0, 1).toUpperCase() + word.slice(1);

// a profile's name as words, such as Worker senior for journal-worker-senior
const profileWords = (profile) => capital(profile.replace(PROFILE_PREFIX, "").replaceAll("-", " "));

// the role and the number of an agent, such as worker 848
export const agentNumber = (agent) => `${agent.role} ${agent.number}`;

// the name of an agent as the server builds it (src/engine/agent/agent_name.py): its role and number, such as Worker 848,
// and Main agent for the main agent; tests/fixtures/agent_names.json holds the names both sides must print
export const agentName = (agent) => (agent.role === MAIN_ROLE ? MAIN_NAME : `${capital(agent.role)} ${agent.number}`);

// the one way the viewer names an agent: the title is its profile's name (Planner, Worker senior, Merger) or its role when it has
// no profile, and the subtext is its role with its number (worker 848); a given name and a row id are never shown
export function agentTitle(agent, facts = agent.facts) {
    const profile = facts?.profile || agent.profile || "";
    const title = agent.role === MAIN_ROLE || !profile ? ROLE_TITLES[agent.role] ?? capital(agent.role) : profileWords(profile);
    const subtext = agent.role === MAIN_ROLE ? "" : agentNumber(agent);
    const text = agent.role === MAIN_ROLE ? title : profile ? `${title} · ${subtext}` : `${title} ${agent.number}`;
    return {title, subtext, text, name: agentName(agent)};
}
