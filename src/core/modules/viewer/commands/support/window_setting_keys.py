from engine.errors.refusal import Refusal
from core.base.registry.registry import Registry
from engine.setting.setting_group import SettingGroup
from engine.setting.setting_scope import SettingScope
from engine.setting.setting_type import SettingType
from engine.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.viewer"
WINDOW_SETTINGS = f"{MODULE_KEY}.window."
TOUR_COMPLETED = f"{MODULE_KEY}.tour-completed"
VIEWER_SETTINGS = [SettingValue("tour-completed", "Tour completed", "Skip the introductory tour in every browser.", SettingType.FLAG,
                                default=False, scope=SettingScope.PROJECT),
                   SettingGroup("window", "Window settings", "Saved preferences for each window, such as zoom and sort order.",
                                any_key=SettingValue("*", "Window setting", "A saved window preference.", SettingType.ANY,
                                                     scope=SettingScope.ENVIRONMENT))]


class WindowSettingKeys:
    """The setting key of one of a window's own settings, under the viewer's window group: the window is one
    an installed module declares, and the key has no dot, so it never names another window's setting."""

    def __init__(self, registry: Registry) -> None:
        self.registry = registry

    def key(self, window: str, key: str) -> str:
        if not self.registry.has_window(window):
            raise Refusal(f"no installed module declares the window {window}", "journal window permissions <window> needs a window of an installed module")
        if "." in key:
            raise Refusal(f"a window's setting key has no dot: {key}", "name the setting in one word, such as zoom or sort-order")
        return f"{WINDOW_SETTINGS}{window}.{key}"
