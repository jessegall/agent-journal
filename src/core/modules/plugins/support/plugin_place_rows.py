from typing import Protocol


class PluginPlaceRows(Protocol):
    def leave(self, process_id: int, exit_code: int) -> None: ...
