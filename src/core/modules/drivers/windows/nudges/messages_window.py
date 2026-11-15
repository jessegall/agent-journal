from engine.viewer.window import Window
from core.modules.drivers.support.skeletons import DRIVERS_NUDGES_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from core.modules.drivers.windows.nudges.keys.agent_messages_key import AgentMessagesKey


class MessagesWindow(Window):
    """The Nudges window."""

    name = "drivers.nudges"
    title = "Nudges"
    entry = "nudges.js"
    loading = WindowLoading.COMPONENT
    skeleton = DRIVERS_NUDGES_SKELETON
    group = "project"
    icon = WindowIcon.RULE
    reads = ["nudge list", "nudge-record list"]
    events = ["nudge_record.*"]
    keys = [AgentMessagesKey]
