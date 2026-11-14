from engine.viewer.window import Window
from core.modules.tools.support.skeletons import TOOLS_TOOLS_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from core.modules.tools.windows.tools.keys.tools_key import ToolsKey


class ToolsWindow(Window):
    """The Tools window."""

    name = "tools.tools"
    title = "Tools"
    entry = "tools.js"
    loading = WindowLoading.COMPONENT
    skeleton = TOOLS_TOOLS_SKELETON
    place = WindowPlace.PAGE
    group = "project"
    icon = WindowIcon.MENU
    reads = ["tool list"]
    runs = ["tool on", "tool off", "tool install", "tool refresh"]
    events = ["tool.*"]
    keys = [ToolsKey]
