// A sequence step as the viewer shows and edits it: its title, else the first sentence of its instructions, and its guards.
export const stepHeading = (step) => step.title || step.instructions.split(".")[0].slice(0, 80);

export const stepGuards = (step) => [step.file_edits_allowed ? "File edits allowed" : "File edits wait", ...step.allowed_commands.map((pattern) => `Lets through ${pattern}`)];

export const blankStep = () => ({title: "", instructions: "", file_edits_allowed: true, allowed_commands: []});

// A step as the editor holds it, with a key for its card and its commands as one line, and back as the server takes it.
export const stepCard = (step, key) => ({key, ...step, commands: step.allowed_commands.join(", ")});

export const stepBody = (card) => ({
    title: card.title.trim(),
    instructions: card.instructions.trim(),
    file_edits_allowed: card.file_edits_allowed,
    allowed_commands: card.commands
        .split(",")
        .map((pattern) => pattern.trim())
        .filter(Boolean),
});

export function stepsProblem(cards) {
    if (!cards.length) return "A sequence needs at least one step.";
    return cards.some((card) => !card.instructions.trim()) ? "Every step needs its instructions." : "";
}
