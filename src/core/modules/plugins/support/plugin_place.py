from typing import Protocol


class PluginPlaceRows(Protocol):
    def wait(self, process_id: int, limit_seconds: float) -> bool: ...

    def leave(self, process_id: int, exit_code: int) -> None: ...


class PluginPlace:
    """One process of a plugin in the process queue: it waits there for its place and ends its row when the
    process ends."""

    def __init__(self, process_id: int, places: PluginPlaceRows) -> None:
        self.process_id, self.places = process_id, places

    def wait(self, limit_seconds: float) -> bool:
        return self.places.wait(self.process_id, limit_seconds)

    def leave(self, exit_code: int) -> None:
        self.places.leave(self.process_id, exit_code)

    def through(self, places: PluginPlaceRows) -> "PluginPlace":
        return PluginPlace(self.process_id, places)
