from engine.viewer.window import Window
from core.modules.usage.support.skeletons import USAGE_CONTEXT_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from core.modules.usage.windows.context.keys.usage_key import UsageKey


class ContextWindow(Window):
    """The Context window."""

    name = "usage.context"
    title = "Context"
    entry = "context.js"
    loading = WindowLoading.COMPONENT
    skeleton = USAGE_CONTEXT_SKELETON
    icon = WindowIcon.FITNESS
    place = WindowPlace.DROPDOWN
    reads = ["usage show"]
    keys = [UsageKey]
