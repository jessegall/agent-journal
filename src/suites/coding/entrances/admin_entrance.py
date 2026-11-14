from engine.viewer.entrance import Entrance
from suites.coding.viewer.layouts.agent_layout import AgentLayout
from suites.coding.viewer.layouts.home_layout import HomeLayout
from suites.coding.viewer.layouts.phone_layout import PhoneLayout
from suites.coding.viewer.layouts.worker_agent_layout import WorkerAgentLayout
from suites.coding.viewer.presets.agent_presets import AgentPresets
from suites.coding.viewer.presets.home_presets import HomePresets


class AdminEntrance(Entrance):
    """The way in of the person who runs the coding suite: every window it offers, the default layout of each page
    and the presets of the home and agent pages. The windows are named by their keys until the window classes
    exist; then this lists the classes."""

    key = "admin"
    windows = ["messages.chat", "questions.waiting", "questions.questions", "tasks.tasks", "tasks.task-counts", "plans.plans", "agents.agents", "agents.helpers", "schedules.jobs", "memories.memories", "project-rules.rules", "workers.workers", "agents.transcript", "drivers.hook-calls", "coding.file-feed",
               "coding.file-edits", "coding.files", "coding.git", "workers.worktrees", "messages.attachments", "coding.terminal", "processes.outputs", "processes.output", "search.search", "dumps.dumps", "secrets.secrets", "skills.skills", "mcp.integrations", "profiles.profiles", "transcriptions.transcriptions", "reminders.reminders", "sharing.shares", "library.teams", "tunnel.tunnel", "updates.updates", "developer.numbers", "developer.hook-requests", "developer.system-logs", "drivers.nudges", "workers.points", "workers.todos", "documents.documents", "documents.page", "sequences.sequences", "templates.templates", "plugins.plugins", "settings.settings", "settings.project-hooks", "tools.tools", "triggers.triggers", "checks.checks", "usage.load", "usage.usage", "usage.cost", "usage.context", "coding.work-mode"]
    layouts = {"home": HomeLayout, "agent": AgentLayout, "phone": PhoneLayout, "agent@coding.worker": WorkerAgentLayout}
    presets = {"home": HomePresets, "agent": AgentPresets}
