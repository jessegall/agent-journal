from engine.viewer.window import Window
from core.modules.usage.support.skeletons import USAGE_COST_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from core.modules.usage.windows.cost.keys.usage_key import UsageKey


class CostWindow(Window):
    """The Cost window."""

    name = "usage.cost"
    title = "Cost"
    entry = "cost.js"
    loading = WindowLoading.COMPONENT
    skeleton = USAGE_COST_SKELETON
    icon = WindowIcon.FITNESS
    place = WindowPlace.DROPDOWN
    reads = ["usage show"]
    keys = [UsageKey]
