export const CRITIQUE_AGENTS = [1, 2, 3, 5];
export const CRITIQUE_SIZES = ["a quick look", "a normal read", "a thorough review"];

export const critiqueTemplates = (rows) => rows.filter((row) => row.purpose === "critique");

export function critiqueBrief({agents, size, plan, template}) {
    const who = agents === 1 ? "one agent" : `${agents} agents`;
    const guide = template ? `, following template ${template.id} (${template.title})` : "";
    return `Please have ${who} give plan ${plan.id} ${size}${guide}, and compile what they find into a report linked to the plan.`;
}
