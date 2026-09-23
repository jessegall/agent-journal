export const TEMPLATES = [
    {
        key: "product",
        title: "Product",
        purpose: "Features, from an idea to shipped.",
        words: ["feature", "product", "app", "build", "roadmap"],
        stages: [["To do"], ["Doing", "start"], ["Review", "review"], ["Done", "done"]],
    },
    {
        key: "bugs",
        title: "Bugs",
        purpose: "What people report, fixed and checked.",
        words: ["bug", "issue", "customer", "report", "fix", "support"],
        stages: [["Reported"], ["Fixing", "start"], ["Verifying", "review"], ["Closed", "done"]],
    },
    {
        key: "content",
        title: "Content",
        purpose: "Posts and pages, from an idea to published.",
        words: ["blog", "post", "content", "writing", "docs", "marketing", "page"],
        stages: [["Ideas"], ["Writing", "start"], ["Editing", "review"], ["Published", "done"]],
    },
    {
        key: "blank",
        title: "Blank",
        purpose: "Three stages to rename as you like.",
        words: [],
        stages: [["To do"], ["Doing", "start"], ["Done", "done"]],
    },
];

const EFFECTS = {start: "starts an agent in its own worktree", review: "waits for you", done: "closes it once its branch is merged"};

export const effects = (template) =>
    template.stages.filter(([, meaning]) => meaning).map(([stage, meaning]) => `${stage} ${EFFECTS[meaning]}`);

export const hasReview = (template) => template.stages.some(([, meaning]) => meaning === "review");

export const guess = (text) => TEMPLATES.find((template) => template.words.some((word) => text.toLowerCase().includes(word)));

export const withReview = (template) => ({
    ...template,
    stages: [...template.stages.slice(0, -1), ["Review", "review"], template.stages.at(-1)],
});

export const boardBody = (template, title) => ({
    title,
    stages: template.stages.map(([stage]) => stage),
    meanings: Object.fromEntries(template.stages.filter(([, meaning]) => meaning).map(([stage, meaning]) => [stage, meaning])),
});
