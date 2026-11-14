from engine.viewer.window import Window
from core.modules.settings.support.skeletons import PROJECT_HOOKS_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from core.modules.settings.windows.project_hooks.keys.hooks_key import HooksKey


class ProjectHooksWindow(Window):
    """The Hooks window."""

    name = "settings.project-hooks"
    title = "Hooks"
    entry = "project_hooks.js"
    loading = WindowLoading.COMPONENT
    place = WindowPlace.PAGE
    group = "project"
    icon = WindowIcon.MENU
    skeleton = PROJECT_HOOKS_SKELETON
    reads = ["managed-hook list", "hook-call feed"]
    runs = ["managed-hook set", "managed-hook scan", "managed-hook give-back"]
    events = ["managed-hook.*", "hook_call.*"]
    keys = [HooksKey]
