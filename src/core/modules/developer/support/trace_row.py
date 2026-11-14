import json
from dataclasses import dataclass

from engine.database.hook_requests_table import HookRequestsTable


@dataclass(frozen=True)
class TraceRow:
    """A request's developer trace row, kept in the request trace file until a tick writes it to the table."""

    payload: str

    def write(self, table: HookRequestsTable) -> None:
        table.insert(self.payload)

    def text(self) -> str:
        return json.dumps({"row": self.payload})
