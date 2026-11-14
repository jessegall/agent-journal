from engine.viewer.window import Window
from core.modules.developer.support.developer_settings import HOOK_REQUEST_LOG_SETTING
from core.modules.developer.support.developer_settings import TOOLS_SETTING
from core.modules.developer.support.skeletons import DEVELOPER_HOOK_REQUESTS_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from core.modules.developer.windows.hook_requests.keys.requests_key import RequestsKey
from core.modules.developer.windows.hook_requests.keys.queue_key import QueueKey


class HookRequestsWindow(Window):
    """The Request log window."""

    name = "developer.hook-requests"
    title = "Request log"
    entry = "hookRequests.js"
    loading = WindowLoading.COMPONENT
    skeleton = DEVELOPER_HOOK_REQUESTS_SKELETON
    place = WindowPlace.PAGE
    group = "developer"
    required_settings = [TOOLS_SETTING, HOOK_REQUEST_LOG_SETTING]
    icon = WindowIcon.RULE
    reads = ["developer hook-requests", "queue list"]
    unqueued = True
    keys = [RequestsKey, QueueKey]
