from engine.viewer.layout_shape import split, tabs
from engine.viewer.viewer_preset import ViewerPreset
from suites.coding.viewer.presets.agent.agent_work_tabs import AGENT_WORK_TABS


class AgentDefaultPreset(ViewerPreset):
    """An agent's page as it opens: the chat and transcript on the left, its work on the right."""

    key = "default"
    name = "Default"
    text = "The chat on the left, the rest on the right"
    shape = split("row", 0.5, tabs("messages.chat", "agents.transcript"), tabs(*AGENT_WORK_TABS))
