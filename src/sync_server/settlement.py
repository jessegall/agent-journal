from dataclasses import dataclass

from sync_server.logged_change import LoggedChange
from sync_server.rejected_field import RejectedField


@dataclass(frozen=True)
class Settlement:
    """What the server keeps of one pushed change, and the fields it sends back as rejected."""

    change: LoggedChange
    rejected: tuple[RejectedField, ...]

    def is_empty(self) -> bool:
        return not self.change.fields and self.change.is_update()
