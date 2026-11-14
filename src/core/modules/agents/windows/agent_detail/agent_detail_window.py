from engine.viewer.window import Window
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.viewer.skeleton_part import SkeletonPart


class AgentDetailWindow(Window):
    """The Agent window."""

    name = "agents.agent-detail"
    title = "Agent"
    entry = "agent-detail.js"
    loading = WindowLoading.COMPONENT
    place = WindowPlace.SECTION
    icon = WindowIcon.AGENT
    skeleton = [SkeletonPart.line()]
    reads = ["usage inspector", "agent list", "agent-skill list"]
    events = ["agent.*"]
