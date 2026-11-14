from engine.viewer.layout_shape import tabs
from engine.viewer.viewer_preset import ViewerPreset
from suites.coding.viewer.presets.agent.agent_work_tabs import AGENT_WORK_TABS


class AgentChatPreset(ViewerPreset):
    """An agent's chat, transcript and work in one wide column."""

    key = "chat"
    name = "Chat only"
    text = "One wide column"
    shape = tabs("messages.chat", "agents.transcript", *AGENT_WORK_TABS)
