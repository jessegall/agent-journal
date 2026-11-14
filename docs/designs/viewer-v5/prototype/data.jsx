// Sample rows, shaped like what the journal's read commands return
const AGENTS = [
  {id: 1, name: "main", role: "Main agent", state: "started", model: "Opus 5.5", context: 62, task: 9597},
  {id: 4, name: "worker-4", role: "Worker", state: "started", model: "Sonnet 5.5", context: 31, task: 9682},
  {id: 7, name: "worker-7", role: "Worker", state: "paused", model: "Sonnet 5.5", context: 12, task: 9683},
  {id: 12, name: "helper-851", role: "Helper", state: "started", model: "Opus 5.5", context: 48, task: null},
  {id: 15, name: "reviewer-3", role: "Reviewer", state: "open", model: "Opus 5.5", context: 0, task: null},
];

const TASKS = [
  {id: 9597, title: "Fix the full-run failures grouped in report 1376", state: "started", by: "main", plan: 1131, phase: 2, complexity: 4, priority: "high", tags: ["tests"]},
  {id: 9682, title: "Plan card agent badges: no Agents: label, centred text, smaller icon", state: "started", by: "worker-4", plan: 1131, phase: 1, complexity: 2, priority: "normal", tags: ["viewer"]},
  {id: 9683, title: "File feed shows a moved file as moved, with where it came from", state: "blocked", by: "worker-7", plan: 1131, phase: 1, complexity: 3, priority: "normal", tags: ["viewer"], reason: "Waits on task 9682 for the shared row"},
  {id: 9684, title: "Ship a journal skill for cleaning up loose tasks", state: "open", plan: 1131, phase: 3, complexity: 2, priority: "low", tags: ["skills"]},
  {id: 9686, title: "expect_nudge: a story checks a nudge by its declaration and values", state: "open", plan: 1132, phase: 1, complexity: 3, priority: "normal", tags: ["tests"]},
  {id: 9690, title: "Module fields read like marks = WORKER_MARKS, long ones in their own files", state: "open", plan: null, complexity: 4, priority: "low", tags: []},
  {id: 9692, title: "Build the viewer v5 layouts from doc 1275", state: "open", plan: 1133, phase: 1, complexity: 5, priority: "high", tags: ["viewer"]},
  {id: 9693, title: "Every row reference in the viewer opens its inspector", state: "open", plan: 1133, phase: 2, complexity: 3, priority: "high", tags: ["viewer"]},
  {id: 9512, title: "The overview block always has a way out, also under a locked database", state: "testing", by: "worker-4", plan: 1130, phase: 2, complexity: 3, priority: "high", tags: []},
  {id: 9681, title: "Ship a journal skill for draining failed tests", state: "completed", by: "worker-7", plan: 1131, phase: 3, complexity: 2, priority: "normal", tags: ["skills"]},
  {id: 9680, title: "The sins drain teaches: after fixing an area, rerun only that detector", state: "completed", by: "worker-4", plan: 1131, phase: 3, complexity: 2, priority: "low", tags: ["skills"]},
  {id: 9676, title: "Remove the unused ClaudeInbox write path", state: "cancelled", plan: null, complexity: 1, priority: "low", tags: []},
];

const PLANS = [
  {id: 1131, title: "Loose tasks B: viewer, story tooling, drain skills, architecture upkeep", state: "started", by: "main", brief: "Clear the loose tasks that touch the viewer, the story kit and the skills that drain failures, so version 5 ships without stragglers. Each phase ends with its own full run; task 9597 runs beside phase 1.", phases: [
    {n: 1, title: "Viewer polish", tasks: [9682, 9683]}, {n: 2, title: "Story tooling", tasks: [9597]}, {n: 3, title: "Drain skills", tasks: [9684, 9681, 9680]}]},
  {id: 1132, title: "Tests that a rename or a new default never breaks", state: "started", by: "worker-4", brief: "Stories and unit tests name declared things by reference.", phases: [{n: 1, title: "Story kit", tasks: [9686]}]},
  {id: 1130, title: "Loose tasks A: server, workers and agents, safety fixes", state: "blocked", by: "main", reason: "Waits on the database lock fix in task 9512", brief: "Server-side loose ends.", phases: [{n: 1, title: "Server", tasks: []}, {n: 2, title: "Safety", tasks: [9512]}]},
  {id: 1133, title: "Viewer v5: one look for every page", state: "ready", by: "helper-851", brief: "Build the shared layouts doc 1275 names, then move every page onto them.", phases: [{n: 1, title: "Shared layouts", tasks: [9692]}, {n: 2, title: "Pages", tasks: [9693]}]},
];

const MESSAGES = [
  {id: 120010, by: "Jesse", at: "1 h ago", text: "Please send out the designer. Make every page coherent before release."},
  {id: 120079, by: "Jesse", at: "40 min ago", text: "Stacked inspectors should slide, and files take comments too."},
  {id: 120111, by: "Jesse", at: "20 min ago", text: "Better filtering in the task window than the Show in plan toggle."},
  {id: 120115, by: "Jesse", at: "18 min ago", text: "If you see plan 1132 you must be able to click on it."},
];

const COMMENTS = {
  "plan:1131": [
    {id: 1, by: "Jesse", at: "2 h ago", text: "Phase 2 can start before phase 1 ends, the viewer work does not block the stories."},
    {id: 2, by: "main", agent: true, at: "1 h ago", text: "Agreed. Task 9597 is started beside phase 1."},
  ],
  "doc:1402": [
    {id: 11, n: 1, by: "Jesse", at: "40 min ago", quote: "the comment bar spans the full width", text: "Keep the box floating and as wide as the text column.", reply: {by: "helper-851", text: "The design keeps it at 640 px, centred under the text."}},
    {id: 12, n: 2, by: "Jesse", at: "12 min ago", quote: "Tunnel moves into Settings", text: "And Tunler with it, both are connections."},
  ],
  "task:9597": [{id: 21, by: "Jesse", at: "3 h ago", text: "Group the failures by detector first, as report 1376 does."}],
};

const DOC_TEXT = `# Viewer v5: shared layouts

The viewer draws every page from **five layouts** and one set of components, so a person who learns one page knows them all. Plan 1133 builds it; task 9692 starts with the layouts.

## Why

The documents page, the skills page and the inspectors each grew their own header, tabs and comment box. In the document inspector the comment bar spans the full width; in the plan inspector it floats. The plan inspector uses pill tabs where every other place uses the underline band.

## What changes

- One inspector shape: the header, the tab band, the body and the comment box share one inset of 16 px.
- The plan's row of buttons becomes one **Actions** menu. Only the next step of the plan stays a button.
- Links become a tab beside Details and Timeline.
- Tunnel moves into Settings, under Connections.
- Every reference, such as plan 1132 or output 489998, opens its inspector.

## Open points

Whether the developer pages stay in the sidebar, or move into Settings with the developer switch, is for the user to decide (message 120010).

\`\`\`
journal pin make "Viewer v5" --link https://claude.ai/design/...
\`\`\`
`;

const DOCS = [
  {id: 1402, term: "doc", title: "Viewer v5: shared layouts", abstract: "The five layouts and the components every page is drawn from, and where each is used", state: "open", at: "12 min ago", group: "Today", body: DOC_TEXT},
  {id: 1398, term: "doc", title: "The one execution queue", abstract: "Classes, three lanes, priorities and the one write turn", state: "open", at: "3 h ago", group: "Today", body: "# The one execution queue\n\nEvery process start goes through one door; plan 1125 builds it.\n\n## Lanes\n\n- Quick runs\n- Tests\n- Long runs\n"},
  {id: 1376, term: "report", title: "Full-run failures, grouped", abstract: "98 failures in 11 groups, most from the renamed settings", state: "open", at: "yesterday", group: "Yesterday", body: "# Full-run failures\n\n98 failures in 11 groups, read from output 489998. Task 9597 fixes them.\n"},
  {id: 1374, term: "report", title: "Claude Code hooks page, read", abstract: "What each hook field does and which ones the journal can use", state: "open", at: "yesterday", group: "Yesterday", body: "# Hooks\n\nThe hooks page, summarised.\n"},
  {id: 1257, term: "doc", title: "One door for every process start", abstract: "Phases 1, 3 and 4 of the process door", state: "closed", at: "5 days ago", group: "Earlier", body: "# One door\n\nClosed: the work landed.\n"},
];

const SKILLS = [
  {id: "journal", title: "journal", desc: "Find your way in the journal: what it is, its basic ideas and which skill to load for what", group: "Journal", required: true, read: true, body: "# The journal\n\nThe journal keeps this project's lasting state beside the code.\n\n- An environment is one line of work.\n- A task is the work in hand.\n"},
  {id: "journal-tasks", title: "journal-tasks", desc: "Use tasks to declare, log and finish the current work", group: "Journal", required: false, read: true, body: "# Tasks\n\nDeclare a task before you work.\n"},
  {id: "journal-documents", title: "journal-documents", desc: "Write lasting knowledge as documents and what was checked as reports", group: "Journal", required: false, read: false, body: "# Documents\n\nA document holds knowledge that lasts.\n"},
  {id: "commandments-vue-vue-components", title: "commandments-vue-vue-components", desc: "Extract a component when template markup repeats identically", group: "Commandments", required: false, read: false, body: "# Vue components\n\nRepeated markup is one component waiting to be born.\n"},
  {id: "commandments-plain-viewer-text", title: "commandments-plain-viewer-text", desc: "Any text a person reads in the viewer says what it is in plain words", group: "Commandments", required: true, read: true, body: "# Plain viewer text\n\nA label says what it is.\n"},
];

const MEMORIES = [
  {id: 812, title: "Memory 812", desc: "The user wants the comment box floating everywhere, as the plan has it", group: "main", weight: 8, state: "active", body: "The user wants the comment box floating everywhere, as the plan inspector has it. Never span it across the full width."},
  {id: 809, title: "Memory 809", desc: "Tunnel and Tunler belong in Settings", group: "main", weight: 6, state: "active", body: "Tunnel and Tunler belong in Settings, under Connections."},
  {id: 790, title: "Memory 790", desc: "Run only the detector of the area you fixed", group: "worker-4", weight: 4, state: "active", body: "After fixing an area, rerun only that detector, as task 9680 teaches."},
];

const PROFILES = [
  {id: "journal-worker", title: "journal-worker", desc: "A worker that writes code in its own worktree", group: "Workers", body: "# journal-worker\n\nModel: Sonnet 5.5 · effort medium\n"},
  {id: "journal-worker-senior", title: "journal-worker-senior", desc: "A worker for complexity 4 and 5", group: "Workers", body: "# journal-worker-senior\n\nModel: Opus 5.5 · effort high\n"},
  {id: "journal-designer", title: "journal-designer", desc: "Designs one screen or flow in Claude Design", group: "Helpers", body: "# journal-designer\n\nModel: Opus 5.5\n"},
];
const TEMPLATES = [
  {id: "plan-default", title: "Plan: default", desc: "Phases with a test command and a checkpoint each", group: "Plans", body: "# Plan template\n\n1. Brief\n2. Phases\n"},
  {id: "task-bug", title: "Task: bug", desc: "What happens, what should happen, how to see it", group: "Tasks", body: "# Bug\n\n## What happens\n\n## What should happen\n"},
];
const RULES = [
  {id: 10, title: "Rule 10", desc: "Never use a word of these lists in a name you write", group: "Active", body: "Project rule (message 113608): never use a word of these lists in a name you write."},
  {id: 14, title: "Rule 14", desc: "Proposed by worker-4: run the hook runner tests before changing it", group: "Proposed", body: "Run the Go and Python tests that cover the hook runner before changing it."},
];
const SEQUENCES = [
  {id: 31, title: "Release check", desc: "Full run, changelog, tag, deploy — one step at a time", group: "Sequences", body: "# Release check\n\n1. Full run\n2. Changelog\n3. Tag\n"},
];
const TRANSCRIPTIONS = [
  {id: 120010, title: "Message 120010", desc: "Cool. Please send out the designer. Fine-tuning the document designer…", group: "Today", body: "Cool. Please send out the designer. Fine-tuning the document designer, for example, or the document inspector."},
];

// project files for the IDE page. git: M changed, A new, D deleted, R moved (from), ? not tracked
const FILE_TREE = {name: "agent-journal", path: "", dir: true, children: [
  {name: "src", path: "src", dir: true, children: [
    {name: "viewer", path: "src/viewer", dir: true, children: [
      {name: "src", path: "src/viewer/src", dir: true, children: [
        {name: "resource", path: "src/viewer/src/resource", dir: true, children: [
          {name: "Inspector.vue", path: "src/viewer/src/resource/Inspector.vue", git: "M", by: "worker-4", task: 9682},
          {name: "InspectorHead.vue", path: "src/viewer/src/resource/InspectorHead.vue"},
        ]},
        {name: "kit", path: "src/viewer/src/kit", dir: true, children: [
          {name: "QuickCommentBar.vue", path: "src/viewer/src/kit/QuickCommentBar.vue"},
          {name: "ActionMenu.vue", path: "src/viewer/src/kit/ActionMenu.vue", git: "A", by: "worker-4", task: 9682},
          {name: "CommentRail.vue", path: "src/viewer/src/kit/CommentRail.vue", git: "R", from: "src/viewer/src/resource/CommentSide.vue", by: "worker-7", task: 9683},
          {name: "Segmented.vue", path: "src/viewer/src/kit/Segmented.vue"},
        ]},
        {name: "tokens.css", path: "src/viewer/src/tokens.css"},
      ]},
      {name: "package.json", path: "src/viewer/package.json"},
    ]},
    {name: "core", path: "src/core", dir: true, children: [
      {name: "modules", path: "src/core/modules", dir: true, children: [
        {name: "plans", path: "src/core/modules/plans", dir: true, children: [{name: "plans_module.py", path: "src/core/modules/plans/plans_module.py"}, {name: "plan_inspector.py", path: "src/core/modules/plans/support/plan_inspector.py", git: "M", by: "main", task: 9597}]},
      ]},
    ]},
  ]},
  {name: "tests", path: "tests", dir: true, children: [{name: "conftest.py", path: "tests/conftest.py"}]},
  {name: "notes.md", path: "notes.md", git: "?"},
  {name: "README.md", path: "README.md"},
  {name: "pyproject.lock", path: "pyproject.lock", big: true},
  {name: "logo.png", path: "logo.png", binary: true},
]};

const FILE_TEXT = {
  "src/core/modules/plans/support/plan_inspector.py": `from engine.viewer.button_declaration import ButtonDeclaration
from engine.viewer.inspector_declaration import InspectorDeclaration

# the plan's actions: one primary next step, the rest in the Actions menu
ASSIGNABLE = ("draft", "ready", "approved", "started", "blocked")

PLAN_INSPECTOR = InspectorDeclaration(
    Plan,
    reads="plan inspect {row_id}",
    label="Plan {id} · {state}",
    title="{title}",
    width=InspectorWidth.LARGE,
    comments=True,
    actions=(
        ButtonDeclaration("plans.assign-agent", (), "Assign to an agent", "plan assign {row_id} --to={agent}"),
        ButtonDeclaration("plans.pause", (), "Pause the plan", "plan block {row_id} --reason={reason}"),
        ButtonDeclaration("plans.complete", (), "Complete the plan", "plan close {row_id}"),
    ),
    links=InspectorLinks(excludes_plan=True),
)
`,
  "src/viewer/src/resource/Inspector.vue": `<script setup>
import InspectorShell from "../kit/InspectorShell.vue";
import ActionMenu from "../kit/ActionMenu.vue";
import CommentBox from "../kit/CommentBox.vue";

// the one layout of an inspector: head, tab band, body, comment box
const props = defineProps({term: String, id: Number});
</script>

<template>
    <InspectorShell :term="term" :id="id">
        <template #actions><ActionMenu :actions="actions" /></template>
    </InspectorShell>
</template>
`,
  "README.md": `# Agent journal\n\nThe journal keeps a project's lasting state beside the code.\n\nRun \`journal overview\` to start.\n`,
  "notes.md": `# Notes\n\nNot in git yet.\n`,
};

const PLUGINS = [
  {id: "status-band", title: "Status band", version: "1.4.0", on: true, desc: "A band over the chat with the build state", services: 1},
  {id: "voice", title: "Voice notes", version: "0.9.2", on: false, desc: "Record a message and send its transcript", services: 0},
  {id: "linear-sync", title: "Linear sync", version: "2.0.1", on: true, desc: "Keeps tasks and Linear issues in step", services: 2, fault: "The last sync failed: the token expired"},
];
const INTEGRATIONS = [
  {id: "github", title: "GitHub", version: "MCP", on: true, desc: "Issues, pull requests, files"},
  {id: "linear", title: "Linear", version: "MCP", on: true, desc: "Issues and projects"},
  {id: "blender", title: "Blender", version: "MCP", on: false, desc: "Drives a live Blender"},
];
const SECRETS = [
  {id: "gh", title: "GitHub token", version: "Token", on: true, desc: "Used by: workers, GitHub integration"},
  {id: "tunler", title: "Tunler key", version: "Key", on: true, desc: "Used by: the tunnel"},
];
const CHECKS = [
  {id: "unit", title: "Unit tests", version: "passed", on: true, desc: "pytest tests/unit · 41 s · output 489990"},
  {id: "stories", title: "Stories", version: "failed", on: false, desc: "pytest tests/stories · 98 failures · output 489998"},
  {id: "viewer", title: "Viewer tests", version: "passed", on: true, desc: "vitest · 12 s"},
];

const OUTPUTS = [
  {id: 490026, line: "sed -n 55,80p src/core/modules/agents/support/agent_rows.py", state: "started", by: "main", task: 9597, at: "now", took: "—", text: "def agent_rows(query):\n    return query.limit(50)"},
  {id: 489998, line: "pytest tests -x -q", state: "failed", by: "main", task: 9597, at: "25 min ago", took: "6 m 12 s", text: "........................F\nFAILED tests/stories/test_launch.py::test_settings_text\n1 failed, 812 passed in 372 s"},
  {id: 489990, line: "npm --prefix src/viewer run build", state: "completed", by: "worker-4", task: 9682, at: "31 min ago", took: "18 s", text: "built in 17.8 s"},
  {id: 489971, line: "git log --oneline -20", state: "completed", by: "worker-7", task: 9683, at: "40 min ago", took: "0.1 s", text: "e923dfd A run the journal starts..."},
];

const COMMITS = [
  {id: "e923dfd", title: "A run the journal starts for one of a worker's tasks counts against its test limit again", desc: "Jesse Gall · 2 h ago", group: "version-5", body: "As task 9576 made it before the own-runs merge dropped it.\n\n```diff\n- limit = None\n+ limit = worker.test_limit\n```\n"},
  {id: "86b3df5", title: "A stop goes through while a compaction is due", desc: "Jesse Gall · 4 h ago", group: "version-5", body: "Rule priorities are named."},
  {id: "9e5f7da", title: "A worker refused a task someone else holds hears who holds it", desc: "Jesse Gall · 6 h ago", group: "version-5", body: ""},
];

Object.assign(window, {AGENTS, TASKS, PLANS, MESSAGES, COMMENTS, DOCS, SKILLS, MEMORIES, PROFILES, TEMPLATES, RULES, SEQUENCES, TRANSCRIPTIONS, FILE_TREE, FILE_TEXT, PLUGINS, INTEGRATIONS, SECRETS, CHECKS, OUTPUTS, COMMITS});
