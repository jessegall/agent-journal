from engine.viewer.window import Window
from core.modules.drivers.support.skeletons import DRIVERS_HOOK_CALLS_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_shows import WindowShows
from core.modules.drivers.windows.hook_calls.keys.calls_key import CallsKey


class HookCallsWindow(Window):
    """The Activity window."""

    name = "drivers.hook-calls"
    title = "Activity"
    entry = "hook-calls.js"
    loading = WindowLoading.COMPONENT
    skeleton = DRIVERS_HOOK_CALLS_SKELETON
    icon = WindowIcon.RUNS
    shows = WindowShows.SELECTED_AGENT
    reads = ["hook-call feed", "hook-call show", "hook-call stops"]
    events = ["hook_call.*"]
    keys = [CallsKey]
