from engine.viewer.entrance import Entrance
from core.modules.documents.windows.documents.documents_window import DocumentsWindow
from core.modules.documents.windows.page.page_window import PageWindow
from core.modules.memories.windows.memories.memories_window import MemoriesWindow
from core.modules.profiles.windows.profiles.profiles_window import ProfilesWindow
from core.modules.questions.windows.questions.questions_window import QuestionsWindow
from core.modules.questions.windows.waiting.waiting_window import WaitingWindow
from core.modules.reminders.windows.reminders.reminders_window import RemindersWindow
from suites.coding.modules.checks.windows.checks.checks_window import ChecksWindow
from suites.coding.windows.file_edits.file_edits_window import FileEditsWindow
from suites.coding.windows.file_feed.file_feed_window import FileFeedWindow
from suites.coding.windows.files.files_window import FilesWindow
from suites.coding.windows.git.git_window import GitWindow
from suites.coding.windows.terminal.terminal_window import TerminalWindow
from suites.coding.windows.work_mode.work_mode_window import WorkModeWindow
from suites.coding.viewer.layouts.agent_layout import AgentLayout
from suites.coding.viewer.layouts.home_layout import HomeLayout
from suites.coding.viewer.layouts.phone_layout import PhoneLayout
from suites.coding.viewer.layouts.worker_agent_layout import WorkerAgentLayout
from suites.coding.viewer.presets.agent_presets import AgentPresets
from suites.coding.viewer.presets.home_presets import HomePresets


class AdminEntrance(Entrance):
    """The way in of the person who runs the coding suite: every window it offers, the default layout of each page
    and the presets of the home and agent pages. A window written as a class is listed by its class; the
    others, the workers' windows among them, by their names until they are classes."""

    key = "admin"
    windows = ["messages.chat", WaitingWindow, QuestionsWindow, "tasks.tasks", "tasks.task-counts", "plans.plans", "agents.agents", "agents.helpers", "schedules.jobs", MemoriesWindow, "project-rules.rules", "workers.workers", "agents.transcript", "drivers.hook-calls", FileFeedWindow, FileEditsWindow, FilesWindow, GitWindow, "workers.worktrees", "messages.attachments", TerminalWindow, "processes.outputs", "processes.output", "search.search", "dumps.dumps", "secrets.secrets", "skills.skills", "mcp.integrations", ProfilesWindow, "transcriptions.transcriptions", RemindersWindow, "sharing.shares", "library.teams", "tunnel.tunnel", "updates.updates", "developer.numbers", "developer.hook-requests", "developer.system-logs", "drivers.nudges", "workers.points", "workers.todos", DocumentsWindow, PageWindow, "sequences.sequences", "templates.templates", "plugins.plugins", "settings.settings", "settings.project-hooks", "tools.tools", "triggers.triggers", ChecksWindow, "usage.load", "usage.usage", "usage.cost", "usage.context", WorkModeWindow]
    layouts = {"home": HomeLayout, "agent": AgentLayout, "phone": PhoneLayout, "agent@coding.worker": WorkerAgentLayout}
    presets = {"home": HomePresets, "agent": AgentPresets}
