from engine.viewer.window import Window
from core.modules.reminders.support.skeletons import REMINDERS_REMINDERS_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from core.modules.reminders.windows.reminders.keys.reminders_key import RemindersKey


class RemindersWindow(Window):
    """The Reminders window."""

    name = "reminders.reminders"
    title = "Reminders"
    entry = "reminders.js"
    loading = WindowLoading.COMPONENT
    skeleton = REMINDERS_REMINDERS_SKELETON
    place = WindowPlace.PAGE
    group = "project"
    icon = WindowIcon.RULE
    reads = ["reminder list"]
    runs = ["reminder make", "reminder delete"]
    events = ["reminder.*"]
    keys = [RemindersKey]
