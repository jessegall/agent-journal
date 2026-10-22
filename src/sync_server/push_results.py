import json
from dataclasses import replace

from sync_server.db.push_result_rows import PushResultRows
from sync_server.logged_change import LoggedChange
from sync_server.rejected_field import RejectedField
from sync_server.settlement import Settlement


class PushResults:
    """What the server answered for each pushed change, so a push sent again after a lost answer is answered the same and kept once."""

    def __init__(self, rows: PushResultRows) -> None:
        self.rows = rows

    def first_answer(self, device_id: int, local_number: int, change: LoggedChange) -> Settlement | None:
        stored = self.rows.stored(device_id, local_number)
        if stored is None:
            return None
        return Settlement(replace(change, sequence=stored["sequence"]), tuple(RejectedField(**field) for field in json.loads(stored["rejected"])))

    def record(self, device_id: int, local_number: int, settlement: Settlement) -> None:
        self.rows.write(device_id, local_number, settlement.sequence(), settlement.rejected_json())
