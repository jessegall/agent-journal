from core.base.driver.suite import Suite
from core.base.viewer.layout_shape import split, tabs


class CodingSuite(Suite):
    """Building software: the builder or the orchestrator drives the main agent, which starts workers,
    reviewers and verifiers, while the agent program's own subagents read for it; the viewer shows its chat,
    tasks, plans, agents and their activity and file edits."""

    name = "coding"
    defaults = {"main": "coding.builder", "worker": "coding.worker", "subagent": "coding.subagent", "reviewer": "coding.reviewer",
                "verifier": "coding.verifier"}
    windows = ["messages.chat", "tasks.tasks", "plans.plans", "agents.agents", "agents.subagents", "drivers.hook-calls", "coding.file-feed",
               "coding.file-edits", "coding.terminal"]
    layouts = {
        "home": split("row", 0.62, tabs("messages.chat"), tabs("tasks.tasks", "plans.plans", "agents.agents")),
        "home@coding.orchestrator": split("row", 0.5, tabs("agents.agents", "coding.file-edits"),
                                          split("col", 0.5, tabs("tasks.tasks", "plans.plans"), tabs("messages.chat"))),
        "agent": split("row", 0.5, tabs("messages.chat"), tabs("coding.file-feed", "drivers.hook-calls", "agents.subagents", "coding.terminal")),
        "agent@coding.worker": split("row", 0.5, tabs("coding.file-feed", "coding.terminal"), tabs("drivers.hook-calls", "tasks.tasks")),
    }
