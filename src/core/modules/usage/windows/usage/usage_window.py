from engine.viewer.window import Window
from core.modules.usage.support.skeletons import USAGE_USAGE_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from core.modules.usage.windows.usage.keys.usage_key import UsageKey
from core.modules.usage.windows.usage.keys.limits_key import LimitsKey


class UsageWindow(Window):
    """The Usage window."""

    name = "usage.usage"
    title = "Usage"
    entry = "usage.js"
    loading = WindowLoading.COMPONENT
    skeleton = USAGE_USAGE_SKELETON
    icon = WindowIcon.FITNESS
    place = WindowPlace.DROPDOWN
    reads = ["usage show", "usage-limit list"]
    runs = ["usage-limit set", "usage-limit delete"]
    events = ["usage_limit.*"]
    keys = [UsageKey, LimitsKey]
