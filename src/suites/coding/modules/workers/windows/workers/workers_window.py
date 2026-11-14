from engine.viewer.window import Window
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.viewer.window_tab import WindowTab
from suites.coding.modules.workers.support.skeletons import WORKERS_WORKERS_SKELETON
from suites.coding.modules.workers.windows.workers.keys.workers_key import WorkersKey
from suites.coding.modules.workers.windows.workers.keys.recent_key import RecentKey
from suites.coding.modules.workers.windows.workers.keys.split_key import SplitKey
from suites.coding.modules.workers.windows.workers.keys.routes_key import RoutesKey
from suites.coding.modules.workers.windows.workers.keys.tags_key import TagsKey
from suites.coding.modules.workers.windows.workers.keys.split_limits_key import SplitLimitsKey


class WorkersWindow(Window):
    """The Workers window."""

    name = "workers.workers"
    title = "Workers"
    entry = "workers.js"
    loading = WindowLoading.COMPONENT
    skeleton = WORKERS_WORKERS_SKELETON
    icon = WindowIcon.AGENT
    place = WindowPlace.DROPDOWN
    reads = ["agent list", "agent limits", "chat-mark main", "worker split", "worker-route list", "worker-route show", "task tags", "setting show", "provider-outage list"]
    runs = ["message send", "setting set", "worker-route make", "worker-route edit", "worker-route delete", "worker-route move", "provider-outage make", "provider-outage end", "provider-outage delete"]
    events = ["agent.*", "chat_mark.*", "setting.*", "worker_route.*", "provider_outage.*", "task_tag.*"]
    tabs = [WindowTab("workers", "Workers", "agent list --role worker"), WindowTab("split", "Split", "worker split"), WindowTab("recent", "Recent activity", "chat-mark main --type workers.worker")]
    keys = [WorkersKey, RecentKey, SplitKey, RoutesKey, TagsKey, SplitLimitsKey]
