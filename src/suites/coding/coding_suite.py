from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from engine.enums.agent_role import AgentRole
from engine.module.suite import Suite
from engine.viewer.layout_preset import LayoutPreset
from engine.viewer.layout_shape import split, tabs
from suites.coding.support.coding_settings import WORKER_TEST_LIMIT
from suites.coding.support.next_task import NextTask
from engine.agent.agent_policy import AgentPolicy

AGENT_WORK_TABS = ("coding.terminal", "coding.file-feed", "tasks.tasks", "drivers.hook-calls", "agents.helpers")


class CodingSuite(Suite):
    """Building software: the main agent works from its work controls and starts workers,
    reviewers and verifiers, while helpers read for it; the viewer shows its chat,
    tasks, plans, agents, questions and their activity and file edits, a phone layout, and version 4's
    layout presets."""

    name = "coding"
    task_assigner = NextTask
    agent_policy = AgentPolicy(
        job_roles=tuple(["worker"]),
        active_task_unblocked_roles=tuple(["worker"]),
        task_roles=("main", "worker"), prompt_roles=("main", "worker"), mark_roles=("main", "worker", "helper", "reviewer", "verifier"), plugin_roles=("main", "worker"),
        dispatch_roles=("main", "worker"), stop_required_roles=("main", "worker"),
        private_output_roles=tuple(["worker"]), reader_request_roles=tuple(["worker"]), queued_run_roles=tuple(["worker"]),
       automatic_watch_roles=tuple(["worker"]), continuing_run_roles=tuple(["worker"]),
        project_skill_roles=tuple(["worker"]),
        pause_retention_roles=tuple(["worker"]),
        restricted_alias_roles=tuple(["worker"]),
        saved_command_roles=("main", "helper", "reviewer", "verifier"),
        queue_limit_settings=tuple([WORKER_TEST_LIMIT]),
    )
    defaults = {AgentRole.MAIN: "coding.main", CodingHelperRole.WORKER: "coding.worker", CodingHelperRole.HELPER: "coding.helper", CodingHelperRole.REVIEWER: "coding.reviewer",
                CodingHelperRole.VERIFIER: "coding.verifier"}
    windows = ["messages.chat", "questions.waiting", "questions.questions", "tasks.tasks", "tasks.task-counts", "plans.plans", "agents.agents", "agents.helpers", "schedules.jobs", "memories.memories", "project-rules.rules", "workers.workers", "agents.transcript", "drivers.hook-calls", "coding.file-feed",
               "coding.file-edits", "coding.files", "coding.git", "workers.worktrees", "messages.attachments", "coding.terminal", "processes.outputs", "processes.output", "search.search", "dumps.dumps", "secrets.secrets", "skills.skills", "mcp.integrations", "profiles.profiles", "transcriptions.transcriptions", "reminders.reminders", "sharing.shares", "library.teams", "tunnel.tunnel", "updates.updates", "developer.numbers", "developer.hook-requests", "developer.system-logs", "drivers.nudges", "workers.points", "workers.todos", "documents.documents", "sequences.sequences", "templates.templates", "plugins.plugins", "settings.settings", "settings.project-hooks", "tools.tools", "triggers.triggers", "checks.checks", "usage.load", "usage.usage", "usage.cost", "usage.context", "coding.work-mode"]
    layouts = {
        "home": split("row", 0.5, tabs("messages.chat", "coding.terminal"), tabs("tasks.tasks", "plans.plans", "questions.questions", "coding.file-feed", active="coding.file-feed")),
        "agent": split("row", 0.5, tabs("messages.chat"), tabs("coding.file-feed", "drivers.hook-calls", "agents.helpers", "coding.terminal")),
        "phone": tabs("messages.chat", "questions.waiting", "questions.questions", "tasks.tasks", "plans.plans", "agents.agents", "coding.file-feed"),
        "agent@coding.worker": split("row", 0.5, tabs("coding.file-feed", "coding.terminal"),
                                     tabs("workers.points", "workers.todos", "drivers.hook-calls", "tasks.tasks")),
    }
    presets = {
        "home": [
            LayoutPreset("default", "Default", "Chat and side panels", split("row", 0.5, tabs("messages.chat", "coding.terminal"), tabs("tasks.tasks", "plans.plans", "questions.questions", "coding.file-feed", active="coding.file-feed"))),
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
