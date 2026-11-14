from engine.viewer.window import Window
from core.modules.developer.support.developer_settings import TOOLS_SETTING
from core.modules.developer.support.skeletons import DEVELOPER_HOOK_REQUESTS_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from core.modules.developer.windows.system_logs.keys.logs_key import LogsKey


class SystemLogsWindow(Window):
    """The System logs window."""

    name = "developer.system-logs"
    title = "System logs"
    entry = "systemLogs.js"
    loading = WindowLoading.COMPONENT
    skeleton = DEVELOPER_HOOK_REQUESTS_SKELETON
    place = WindowPlace.PAGE
    group = "developer"
    required_settings = [TOOLS_SETTING]
    icon = WindowIcon.RULE
    reads = ["developer system-logs"]
    unqueued = True
    keys = [LogsKey]
