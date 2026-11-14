import {optionsOf, wordLabel} from "@journal/window-kit";

// what the Memories page says about a memory and the filters it offers
export const MAIN_NAME = "Main agent";
export const HIGHEST_WEIGHT = 10;

// the name of the agent a memory belongs to: the page read names the holders, and one it does not name is called by its number
export function ownerName(row, agents) {
    if (row.agent_id === null) return MAIN_NAME;
    return agents.find((agent) => agent.agent_id === row.agent_id)?.name ?? `Agent ${row.agent_id}`;
}

export const memoryFilters = (rows, agents) => [
    {key: "state", label: "State", options: [["active", "Active"], ["removed", "Removed"]], get: (row) => row.state, default: ["active"]},
    {key: "agent", label: "Agent", options: optionsOf(rows, (row) => ownerName(row, agents)), get: (row) => ownerName(row, agents)},
];

export const stateWords = (row) => wordLabel(row.state);
