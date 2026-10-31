from core.base.agent_role import AgentRole
from core.base.driver.suite import Suite
from core.base.viewer.layout_preset import LayoutPreset
from core.base.viewer.layout_shape import split, tabs

AGENT_WORK_TABS = ("coding.terminal", "coding.file-feed", "tasks.tasks", "drivers.hook-calls", "agents.subagents")


class CodingSuite(Suite):
    """Building software: the builder or the orchestrator drives the main agent, which starts workers,
    reviewers and verifiers, while the agent program's own subagents read for it; the viewer shows its chat,
    tasks, plans, agents, questions and their activity and file edits, a phone layout, and version 4's layout presets."""

    name = "coding"
    defaults = {AgentRole.MAIN: "coding.builder", AgentRole.WORKER: "coding.worker", AgentRole.SUBAGENT: "coding.subagent", AgentRole.REVIEWER: "coding.reviewer",
                AgentRole.VERIFIER: "coding.verifier"}
    windows = ["messages.chat", "questions.waiting", "questions.questions", "tasks.tasks", "plans.plans", "agents.agents", "agents.subagents", "agents.transcript", "drivers.hook-calls", "coding.file-feed",
               "coding.file-edits", "coding.terminal", "workers.points", "workers.todos"]
    layouts = {
        "home": split("row", 0.62, tabs("messages.chat"), tabs("tasks.tasks", "plans.plans", "agents.agents")),
        "home@coding.orchestrator": split("row", 0.5, tabs("agents.agents", "coding.file-edits"),
                                          split("col", 0.5, tabs("tasks.tasks", "plans.plans"), tabs("messages.chat"))),
        "agent": split("row", 0.5, tabs("messages.chat"), tabs("coding.file-feed", "drivers.hook-calls", "agents.subagents", "coding.terminal")),
        "phone": tabs("messages.chat", "questions.waiting", "questions.questions", "tasks.tasks", "plans.plans", "agents.agents", "coding.file-feed"),
        "agent@coding.worker": split("row", 0.5, tabs("coding.file-feed", "coding.terminal"),
                                     tabs("workers.points", "workers.todos", "drivers.hook-calls", "tasks.tasks")),
    }
    presets = {
        "home": [
            LayoutPreset("default", "Default", "Chat and side panels", split("row", 0.7, tabs("messages.chat"), tabs("tasks.tasks", "plans.plans"))),
            LayoutPreset("developer", "Developer", "A layout for developers",
                         split("row", 0.62, tabs("messages.chat"), split("col", 0.74, tabs("coding.file-feed", "tasks.tasks"), tabs("coding.terminal")))),
            LayoutPreset("chat", "Chat only", "Only the chat", tabs("messages.chat")),
            LayoutPreset("terminal", "Terminal", "Big terminal, small chat", split("row", 0.72, tabs("coding.terminal"), tabs("messages.chat"))),
            LayoutPreset("review", "Review", "Feed and chat", split("row", 0.5, tabs("coding.file-feed"), tabs("messages.chat"))),
            LayoutPreset("monitor", "Monitor", "Terminal, feed, tasks",
                         split("row", 0.62, tabs("coding.terminal"), split("col", 0.55, tabs("coding.file-feed"), tabs("tasks.tasks")))),
            LayoutPreset("inbox", "Inbox", "Chat, plans, tasks", split("row", 0.6, tabs("messages.chat"), split("col", 0.5, tabs("plans.plans"), tabs("tasks.tasks")))),
            LayoutPreset("agents", "Agents", "Agents", split("row", 0.34, tabs("messages.chat"), tabs("agents.agents"))),
        ],
        "agent": [
            LayoutPreset("default", "Default", "The chat on the left, the rest on the right",
                         split("row", 0.5, tabs("messages.chat", "agents.transcript"), tabs(*AGENT_WORK_TABS))),
            LayoutPreset("chat", "Chat only", "One wide column", tabs("messages.chat", "agents.transcript", *AGENT_WORK_TABS)),
            LayoutPreset("terminal", "Terminal", "The terminal wide, the chat beside it",
                         split("row", 0.62, tabs(*AGENT_WORK_TABS), tabs("messages.chat", "agents.transcript"))),
            LayoutPreset("file-edits", "File edits", "What it changed, next to what it says",
                         split("row", 0.5, tabs("coding.file-feed", *(name for name in AGENT_WORK_TABS if name != "coding.file-feed")), tabs("messages.chat", "agents.transcript"))),
        ],
    }
