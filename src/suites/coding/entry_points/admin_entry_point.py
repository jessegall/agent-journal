from engine.viewer.entry_point import EntryPoint
from core.modules.agents.windows.agents.agents_window import AgentsWindow
from core.modules.agents.windows.helpers.helpers_window import HelpersWindow
from core.modules.agents.windows.transcript.transcript_window import TranscriptWindow
from core.modules.developer.windows.hook_requests.hook_requests_window import HookRequestsWindow
from core.modules.developer.windows.numbers.numbers_window import NumbersWindow
from core.modules.developer.windows.system_logs.system_logs_window import SystemLogsWindow
from core.modules.documents.windows.documents.documents_window import DocumentsWindow
from core.modules.documents.windows.page.page_window import PageWindow
from core.modules.drivers.windows.hook_calls.hook_calls_window import HookCallsWindow
from core.modules.drivers.windows.agent_messages.messages_window import MessagesWindow
from core.modules.dumps.windows.dumps.dumps_window import DumpsWindow
from core.modules.library.windows.teams.teams_window import TeamsWindow
from core.modules.mcp.windows.integrations.integrations_window import IntegrationsWindow
from core.modules.memories.windows.memories.memories_window import MemoriesWindow
from core.modules.messages.windows.attachments.attachments_window import AttachmentsWindow
from core.modules.messages.windows.avatar.avatar_window import AvatarWindow
from core.modules.messages.windows.chat.chat_window import ChatWindow
from core.modules.plans.windows.plans.plans_window import PlansWindow
from core.modules.plugins.windows.plugins.plugins_window import PluginsWindow
from core.modules.processes.windows.output.output_window import OutputWindow
from core.modules.processes.windows.outputs.outputs_window import OutputsWindow
from core.modules.profiles.windows.profiles.profiles_window import ProfilesWindow
from core.modules.project_rules.windows.rules.rules_window import RulesWindow
from core.modules.questions.windows.questions.questions_window import QuestionsWindow
from core.modules.questions.windows.waiting.waiting_window import WaitingWindow
from core.modules.reminders.windows.reminders.reminders_window import RemindersWindow
from core.modules.schedules.windows.jobs.jobs_window import JobsWindow
from core.modules.search.windows.search.search_window import SearchWindow
from core.modules.secrets.windows.secrets.secrets_window import SecretsWindow
from core.modules.sequences.windows.sequences.sequences_window import SequencesWindow
from core.modules.settings.windows.project_hooks.project_hooks_window import ProjectHooksWindow
from core.modules.settings.windows.settings.settings_window import SettingsWindow
from core.modules.sharing.windows.shares.shares_window import SharesWindow
from core.modules.skills.windows.skills.skills_window import SkillsWindow
from core.modules.tasks.windows.task_counts.task_counts_window import TaskCountsWindow
from core.modules.tasks.windows.tasks.tasks_window import TasksWindow
from core.modules.templates.windows.templates.templates_window import TemplatesWindow
from core.modules.tools.windows.tools.tools_window import ToolsWindow
from core.modules.transcriptions.windows.transcriptions.transcriptions_window import TranscriptionsWindow
from core.modules.triggers.windows.triggers.triggers_window import TriggersWindow
from core.modules.tunnel.windows.tunnel.tunnel_window import TunnelWindow
from core.modules.updates.windows.updates.updates_window import UpdatesWindow
from core.modules.usage.windows.context.context_window import ContextWindow
from core.modules.usage.windows.cost.cost_window import CostWindow
from core.modules.usage.windows.load.load_window import LoadWindow
from core.modules.usage.windows.usage.usage_window import UsageWindow
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

ADMIN_ENTRY_POINT_KEY = "admin"


class AdminEntryPoint(EntryPoint):
    """The way in of the person who runs the coding suite: the windows of the coding module and the core
    modules it depends on, the default layout of each page and the presets of the home and agent pages. Its
    suite modules add their own windows in entrances of their own under the same key."""

    key = ADMIN_ENTRY_POINT_KEY
    windows = [ChatWindow, AvatarWindow, WaitingWindow, QuestionsWindow, TasksWindow, TaskCountsWindow, PlansWindow, AgentsWindow, HelpersWindow, JobsWindow, MemoriesWindow, RulesWindow, TranscriptWindow, HookCallsWindow, FileFeedWindow, FileEditsWindow, FilesWindow, GitWindow, AttachmentsWindow, TerminalWindow, OutputsWindow, OutputWindow, SearchWindow, DumpsWindow, SecretsWindow, SkillsWindow, IntegrationsWindow, ProfilesWindow, TranscriptionsWindow, RemindersWindow, SharesWindow, TeamsWindow, TunnelWindow, UpdatesWindow, NumbersWindow, HookRequestsWindow, SystemLogsWindow, MessagesWindow, DocumentsWindow, PageWindow, SequencesWindow, TemplatesWindow, PluginsWindow, SettingsWindow, ProjectHooksWindow, ToolsWindow, TriggersWindow, LoadWindow, UsageWindow, CostWindow, ContextWindow, WorkModeWindow]
    layouts = {"home": HomeLayout, "agent": AgentLayout, "phone": PhoneLayout, "agent@coding.worker": WorkerAgentLayout}
    presets = {"home": HomePresets, "agent": AgentPresets}
