export const PRESETS = [
    {key: "tasks", suggest: "Tasks", stages: [["To do"], ["Doing", "start"], ["Done", "done"]]},
    {
        key: "product",
        suggest: "Product",
        stages: [["Backlog"], ["Ready"], ["In progress", "start"], ["Review", "review"], ["Done", "done"]],
    },
    {key: "roadmap", suggest: "Roadmap", stages: [["Ideas"], ["Planned"], ["Building", "start"], ["Shipped", "done"]]},
    {key: "empty", suggest: "Board", stages: [], note: "No stages yet. Add your own on the board."},
];

export const boardBody = (preset, title) => ({
    title,
    stages: preset.stages.map(([stage]) => stage),
    meanings: Object.fromEntries(preset.stages.filter(([, meaning]) => meaning).map(([stage, meaning]) => [stage, meaning])),
});
