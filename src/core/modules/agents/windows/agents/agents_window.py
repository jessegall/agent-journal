from engine.viewer.window import Window
from core.modules.agents.support.agent_searcher import AgentSearcher
from core.modules.agents.support.card_window_lines import CARD_EVENTS
from core.modules.agents.support.card_window_lines import CARD_READS
from core.modules.agents.support.card_window_lines import CARD_TABS
from core.modules.agents.support.skeletons import AGENTS_AGENTS_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.viewer.window_search import WindowSearch
from core.modules.agents.windows.agents.keys.reports_key import ReportsKey
from core.modules.agents.windows.agents.keys.agents_key import AgentsKey
from core.modules.agents.windows.agents.keys.card_key import CardKey
from core.modules.agents.windows.agents.keys.filters_key import FiltersKey
from core.modules.agents.windows.agents.keys.programs_key import ProgramsKey
from core.modules.agents.windows.agents.keys.tool_key import ToolKey
from core.modules.agents.windows.agents.keys.transcript_key import TranscriptKey
from core.modules.agents.windows.agents.keys.jobs_key import JobsKey
from core.modules.agents.windows.agents.keys.terminal_output_key import TerminalOutputKey


class AgentsWindow(Window):
    """The Agents window."""

    name = "agents.agents"
    title = "Agents"
    entry = "agents.js"
    loading = WindowLoading.COMPONENT
    skeleton = AGENTS_AGENTS_SKELETON
    search = WindowSearch(AgentSearcher, "Search the agents")
    icon = WindowIcon.AGENT
    reads = ["agent show", *CARD_READS]
    runs = ["setting set", "message send", "helper send", "helper stop", "agent retire", "agent driver", "agent pause", "agent resume", "agent stop", "process lift-hold"]
    events = CARD_EVENTS
    tabs = CARD_TABS
    keys = [ReportsKey, AgentsKey, CardKey, FiltersKey, ProgramsKey, ToolKey, TranscriptKey, JobsKey, TerminalOutputKey]
