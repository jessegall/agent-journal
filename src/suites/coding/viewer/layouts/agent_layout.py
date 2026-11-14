from engine.viewer.layout_shape import split, tabs
from engine.viewer.viewer_layout import ViewerLayout


class AgentLayout(ViewerLayout):
    """An agent's page as it opens: its chat beside its file feed, hook calls, helpers and terminal."""

    shape = split("row", 0.5, tabs("messages.chat"), tabs("coding.file-feed", "drivers.hook-calls", "agents.helpers", "coding.terminal"))
