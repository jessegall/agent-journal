from engine.viewer.layout_shape import split, tabs
from engine.viewer.viewer_preset import ViewerPreset
from suites.coding.viewer.presets.agent.agent_work_tabs import AGENT_WORK_TABS


class AgentTerminalPreset(ViewerPreset):
    """An agent's work wide, its chat and transcript beside it."""

    key = "terminal"
    name = "Terminal"
    text = "The terminal wide, the chat beside it"
    shape = split("row", 0.62, tabs(*AGENT_WORK_TABS), tabs("messages.chat", "agents.transcript"))
