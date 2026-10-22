import json
from dataclasses import asdict, dataclass

from sync_server.logged_change import LoggedChange
from sync_server.rejected_field import RejectedField


@dataclass(frozen=True)
class Settlement:
    """What the server keeps of one pushed change, and the fields it sends back as rejected."""

    change: LoggedChange
    rejected: tuple[RejectedField, ...]

    def is_empty(self) -> bool:
        return not self.change.fields and self.change.is_update()

    def sequence(self) -> int:
        return self.change.sequence

    def rejected_json(self) -> str:
        return json.dumps([asdict(field) for field in self.rejected])
