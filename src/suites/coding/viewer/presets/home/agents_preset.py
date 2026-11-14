from engine.viewer.layout_shape import split, tabs
from engine.viewer.viewer_preset import ViewerPreset


class AgentsPreset(ViewerPreset):
    """The chat beside the agents."""

    key = "agents"
    name = "Agents"
    text = "Agents"
    shape = split("row", 0.34, tabs("messages.chat"), tabs("agents.agents"))
