from engine.viewer.window import Window
from core.modules.agents.support.agent_searcher import AgentSearcher
from core.modules.agents.support.card_window_lines import CARD_EVENTS
from core.modules.agents.support.card_window_lines import CARD_READS
from core.modules.agents.support.card_window_lines import CARD_TABS
from core.modules.agents.support.skeletons import AGENTS_HELPERS_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_shows import WindowShows
from engine.viewer.window_search import WindowSearch
from core.modules.agents.windows.helpers.keys.reports_key import ReportsKey
from core.modules.agents.windows.helpers.keys.agents_key import AgentsKey
from core.modules.agents.windows.helpers.keys.card_key import CardKey
from core.modules.agents.windows.helpers.keys.filters_key import FiltersKey
from core.modules.agents.windows.helpers.keys.programs_key import ProgramsKey
from core.modules.agents.windows.helpers.keys.tool_key import ToolKey
from core.modules.agents.windows.helpers.keys.transcript_key import TranscriptKey
from core.modules.agents.windows.helpers.keys.jobs_key import JobsKey
from core.modules.agents.windows.helpers.keys.terminal_output_key import TerminalOutputKey


class HelpersWindow(Window):
    """The Helpers window."""

    name = "agents.helpers"
    title = "Helpers"
    entry = "helpers.js"
    loading = WindowLoading.COMPONENT
    skeleton = AGENTS_HELPERS_SKELETON
    icon = WindowIcon.SUBAGENT
    shows = WindowShows.SELECTED_AGENT
    search = WindowSearch(AgentSearcher, "Search the agents")
    reads = CARD_READS
    runs = ["setting set", "message send", "helper send", "helper stop", "agent retire", "agent driver", "agent pause", "agent resume", "agent stop", "process lift-hold"]
    events = CARD_EVENTS
    tabs = CARD_TABS
    keys = [ReportsKey, AgentsKey, CardKey, FiltersKey, ProgramsKey, ToolKey, TranscriptKey, JobsKey, TerminalOutputKey]
