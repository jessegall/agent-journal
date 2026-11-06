import {createApp, h, reactive} from "vue";
import DockStack from "../src/chat/DockStack.vue";
import {loadDockDeclarations} from "../src/domain/dockRegistry.js";
import {startButtons} from "../src/domain/buttons.js";
import {WINDOW_CONTEXT} from "../src/windows/windowContext.js";
import {WindowSubscriptions} from "../src/windows/windowSubscriptions.js";
import "../src/tokens.css";
import {dockWindow} from "./support/dockWindow.js";

const body = (module, component) => `/@fs/${__PROJECT_ROOT__}/src/core/modules/${module}/web/src/${component}Dock.vue`;
const declarations = [
    {type: "documents.doc", icon: "docs", word: "Document"},
    {type: "documents.report", icon: "reports", word: "Report"},
    ...["draft", "started", "waiting", "paused", "completed", "cancelled"].map((state, i) => ({
        type: `plans.${state}`,
        icon: "plan",
        body_url: body("plans", "Plan"),
        folds: "Phases",
        needs_user: state === "waiting",
        badge: ["Planned", "Started", "", "Paused", "Done", "Cancelled"][i],
    })),
    {type: "project-rules.proposed", icon: "rules", needs_user: true, body_url: body("project_rules", "Rule")},
    {type: "tasks.task", icon: "task", body_url: body("tasks", "Task")},
    {type: "memories.memory", icon: "bulb", word: "Memory", body_url: body("memories", "Memory")},
    {type: "questions.question", icon: "questions", body_url: body("questions", "Question")},
    {type: "dumps.dump", icon: "inbox", word: "Dump", body_url: body("dumps", "Dump")},
    {type: "questions.open", icon: "questions", needs_user: true, draws_head: true, body_url: body("questions", "OpenQuestions")},
    {
        type: "processes.output",
        icon: "terminal",
        draws_head: true,
        folds: "Output",
        leaves_after_seconds: 5,
        body_url: body("processes", "Output"),
        buttons: [{icon: "stop", label: "Stop", runs: "output stop {row_id}", variants: ["running"]}],
    },
].map((d) => ({title: "{row_title}", shipped: true, reads: ["doc show", "report show", "plan show", "process show"], ...d}));
loadDockDeclarations(declarations);
await startButtons("main", {ask: async () => true}).load();
const models = [
    "doc",
    "report",
    "plan",
    "plan",
    "plan",
    "plan",
    "plan",
    "plan",
    "rule",
    "task",
    "memory",
    "question",
    "dump",
    "question",
    "process",
];
const titles = [
    "Design notes",
    "Build report",
    "Draft plan",
    "Started plan",
    "Waiting plan",
    "Paused plan",
    "Done plan",
    "Cancelled plan",
    "Proposed rule",
    "Fix the cart",
    "The cart total is in cents",
    "Where should this go?",
    "Meeting notes",
    "Questions waiting",
    "Running tests",
];
const items = reactive(
    declarations.map((d, i) => ({
        id: i + 1,
        type: d.type,
        target_model: models[i],
        target_id: i + 1,
        title: titles[i],
        state: "docked",
        kept: false,
        created_at: new Date(Date.now() - 601000).toISOString(),
    }))
);
const app = createApp({render: () => h(DockStack, {items, folded: true})});
const subscriptions = new WindowSubscriptions();
app.provide(WINDOW_CONTEXT, dockWindow([], {subscriptions}));
app.mount("#cards");
window.dockDesign = {items, subscriptions};
