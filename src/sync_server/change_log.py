import json
import threading

from sync_server.db.change_rows import ChangeRows
from sync_server.db.row_values import RowValues
from sync_server.db.store import Store
from sync_server.copied_row import CopiedRow
from sync_server.logged_change import LoggedChange
from sync_server.stored_row import StoredRow
PAGE_ROWS = 500


class ChangeLog:
    """The team's changes in the order the server took them, and the current value of every row they made, so a pull is the changes past a number and a full copy is the rows. A held pull waits on the newest sequence kept in memory, never on the database, so a push that holds the store while it wakes the pulls cannot meet a pull that waits for the store; news that is no change, such as a new pinned version, wakes them too."""

    def __init__(self, store: Store, changes: ChangeRows, values: RowValues) -> None:
        self.store, self.changes, self.values = store, changes, values
        self.signal = threading.Condition()
        self.is_closed = False
        self.wakes = 0
        self.latest = changes.head()

    def appended(self, change: LoggedChange) -> LoggedChange:
        with self.store.transaction():
            sequence = self.changes.insert(change)
            current = self.row(change.row_table, change.row) or StoredRow()
            self.values.write(change.row_table, change.row, StoredRow({**current.fields, **change.fields}, {**current.changed_at, **change.changed_at}, {**current.writers, **{name: change.account_id for name in change.fields}}), change.is_deletion(), sequence)
        with self.signal:
            self.latest = max(self.latest, sequence)
            self.signal.notify_all()
        return LoggedChange(**{**change.__dict__, "sequence": sequence})

    def pull_page(self, sequence: int, device_id: int) -> list[LoggedChange]:
        return [LoggedChange(row["row_table"], row["row"], row["action"], row["actor"], row["account_id"], row["device_id"], json.loads(row["fields"]), json.loads(row["changed_at"]), row["sequence"]) for row in self.changes.newer(sequence, device_id, PAGE_ROWS)]

    def head(self) -> int:
        return self.changes.head()

    def row(self, table: str, row: int) -> StoredRow | None:
        stored = self.values.stored(table, row)
        if stored is None or stored["is_deleted"]:
            return None
        return StoredRow(json.loads(stored["fields"]), json.loads(stored["changed_at"]), {name: int(id) for name, id in json.loads(stored["writers"]).items()})

    def is_deleted(self, table: str, row: int) -> bool:
        stored = self.values.stored(table, row)
        return stored is not None and bool(stored["is_deleted"])

    def wait_past(self, head: int, seconds: float) -> None:
        with self.signal:
            wakes = self.wakes
            self.signal.wait_for(lambda: self.is_closed or self.latest > head or self.wakes != wakes, timeout=seconds)

    def wake(self) -> None:
        with self.signal:
            self.wakes += 1
            self.signal.notify_all()

    def close(self) -> None:
        with self.signal:
            self.is_closed = True
            self.signal.notify_all()

    def copied_rows(self) -> list[CopiedRow]:
        return [CopiedRow(row["row_table"], row["row"], json.loads(row["fields"]), json.loads(row["changed_at"])) for row in self.values.existing()]
