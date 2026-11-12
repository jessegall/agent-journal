const MAIN_ROLE = "main";
const ROLE_TITLES = {main: "Main agent", worker: "Worker", helper: "Helper"};

const capital = (word) => word.slice(0, 1).toUpperCase() + word.slice(1);

// the role and the number of an agent, such as worker 848
export const agentNumber = (agent) => `${agent.role} ${agent.number}`;

// the one way the viewer names an agent: the title is its role (Worker, Helper), the subtext is its profile title
// (Medior, Researcher, Merger) and its role with its number (worker 848); a given name and a row id are never shown
export function agentTitle(agent, facts = agent.facts) {
    const title = ROLE_TITLES[agent.role] ?? capital(agent.role);
    const profile = facts?.profile_title || facts?.profile || agent.profile_title || agent.profile || "";
    const subtext = agent.role === MAIN_ROLE ? "" : [profile ? capital(profile) : "", agentNumber(agent)].filter(Boolean).join(" · ");
    return {title, subtext, text: subtext ? `${title} ${subtext}` : title};
}
