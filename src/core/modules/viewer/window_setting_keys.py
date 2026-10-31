from core.base.refusal import Refusal
from core.base.registry.registry import Registry

WINDOW_SETTINGS = "viewer.window."


class WindowSettingKeys:
    """The setting key of one of a window's own settings, viewer.window.<window>.<key>: the window is one an
    installed module declares, and the key has no dot, so it never names another window's setting."""

    def __init__(self, registry: Registry) -> None:
        self.registry = registry

    def key(self, window: str, key: str) -> str:
        if not self.registry.has_window(window):
            raise Refusal(f"no installed module declares the window {window}", "journal window permissions <window> names a window of an installed module")
        if "." in key:
            raise Refusal(f"a window's setting key has no dot: {key}", "name the setting in one word, such as zoom or sort-order")
        return f"{WINDOW_SETTINGS}{window}.{key}"
