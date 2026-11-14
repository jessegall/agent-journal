from engine.viewer.window import Window
from core.modules.developer.support.developer_settings import HOOK_DURATIONS_SETTING
from core.modules.developer.support.developer_settings import TOOLS_SETTING
from core.modules.developer.support.skeletons import DEVELOPER_NUMBERS_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from core.modules.developer.windows.numbers.keys.numbers_key import NumbersKey


class NumbersWindow(Window):
    """The Numbers window."""

    name = "developer.numbers"
    title = "Numbers"
    entry = "numbers.js"
    loading = WindowLoading.COMPONENT
    skeleton = DEVELOPER_NUMBERS_SKELETON
    place = WindowPlace.PAGE
    group = "developer"
    required_settings = [TOOLS_SETTING, HOOK_DURATIONS_SETTING]
    icon = WindowIcon.FITNESS
    reads = ["developer numbers"]
    runs = ["developer reset-numbers"]
    keys = [NumbersKey]
