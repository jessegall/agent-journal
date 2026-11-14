import json
from dataclasses import asdict, dataclass

from engine.database.hook_requests_table import HookRequestsTable


@dataclass(frozen=True)
class TraceReceipt:
    """A viewer's read receipt, kept in the request trace file after the row it completes, so the tick that
    writes the row writes the receipt after it."""

    person_id: int
    client_id: str
    command_id: str
    joined_callers: int

    def write(self, table: HookRequestsTable) -> None:
        table.complete_viewer_read(self.person_id, self.client_id, self.command_id, self.joined_callers)

    def text(self) -> str:
        return json.dumps({"receipt": asdict(self)})
