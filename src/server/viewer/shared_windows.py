from core.base.registry.registry import Registry
from core.base.registry.window_entry import WindowEntry


class SharedWindows:
    """The window that shows a shared row, chosen here by the row's model from the windows that list a read of it
    as shareable, never by the name a client sends."""

    def __init__(self, registry: Registry) -> None:
        self.registry = registry

    def window(self, model: str) -> WindowEntry:
        return next(window for window in self.registry.windows if any(entry.split(" ", 1)[0] == model for entry in window.shared_reads))
