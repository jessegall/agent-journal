from core.modules.plugins.support.plugin_place import PluginPlace
from core.modules.plugins.support.plugin_place_rows import PluginPlaceRows


class NoPluginPlace(PluginPlace):
    """The place of a plugin process the queue has no agent to hold a row for: it holds no row."""

    def __init__(self) -> None:
        pass

    def leave(self, exit_code: int) -> None:
        return

    def resolve(self, places: PluginPlaceRows) -> PluginPlace:
        return self
