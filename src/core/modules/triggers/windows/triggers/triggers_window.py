from engine.viewer.window import Window
from core.modules.triggers.support.skeletons import TRIGGERS_TRIGGERS_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from core.modules.triggers.windows.triggers.keys.triggers_key import TriggersKey


class TriggersWindow(Window):
    """The Triggers window."""

    name = "triggers.triggers"
    title = "Triggers"
    entry = "triggers.js"
    loading = WindowLoading.COMPONENT
    skeleton = TRIGGERS_TRIGGERS_SKELETON
    icon = WindowIcon.TRIGGER
    reads = ["trigger list"]
    runs = ["trigger make", "trigger schedule", "trigger edit", "trigger strike", "trigger pause", "trigger enable"]
    events = ["trigger.*"]
    keys = [TriggersKey]
