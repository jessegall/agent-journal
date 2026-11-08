from typing import Protocol


class PluginPlaceRows(Protocol):
    def wait(self, process_id: int, limit_seconds: float) -> bool: ...

    def leave(self, process_id: int, exit_code: int) -> None: ...
