from core.base.driver.suite import Suite


class CodingSuite(Suite):
    """Building software: the builder or the orchestrator drives the main agent, which starts workers,
    reviewers and verifiers, while the agent program's own subagents read for it; the viewer shows its chat,
    tasks, plans, agents and their activity and file edits."""

    name = "coding"
    defaults = {"main": "coding.builder", "worker": "coding.worker", "subagent": "coding.subagent", "reviewer": "coding.reviewer",
                "verifier": "coding.verifier"}
    windows = ["messages.chat", "tasks.tasks", "plans.plans", "agents.agents", "agents.subagents", "drivers.hook-calls", "coding.file-feed",
               "coding.file-edits", "coding.terminal"]
