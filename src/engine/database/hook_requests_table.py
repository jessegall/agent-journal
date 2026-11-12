from engine.database.database import Database
from engine.database.statement import Statement
from collections.abc import Sequence


KEPT_EVENTS = "('Stop', 'SessionEnd')"


class HookRequestsTable:
    """Stores completed requests without creating command events. Of the newest requests it keeps the number the
    size names, and of the Stop and SessionEnd requests, which are few and slow to explain, as many again."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def filter_options(self) -> list[tuple[str, str]]:
        return [(str(row[0]), str(row[1])) for row in self.database.rows(Statement("SELECT DISTINCT family, sender FROM hook_request_rows"))]

    def record(self, payload: str, size: int) -> None:
        self.record_many([payload], size)

    def record_many(self, payloads: Sequence[str], size: int) -> None:
        with self.database.transaction():
            for payload in payloads:
                self.database.insert(Statement("INSERT INTO hook_requests (payload) VALUES (?)", [payload]))
            self.database.update(Statement(
                "DELETE FROM hook_requests WHERE id NOT IN (SELECT id FROM hook_requests ORDER BY id DESC LIMIT ?)"
                f" AND id NOT IN (SELECT id FROM hook_requests WHERE json_extract(payload, '$.body.hook_event_name') IN {KEPT_EVENTS} ORDER BY id DESC LIMIT ?)",
                [size, size],
            ))

    def kept_row_count(self) -> int:
        return int(self.database.rows(Statement("SELECT count(*) FROM hook_requests"))[0][0])

    def complete_viewer_read(self, person_id: int, client_id: str, command_id: str, joined_callers: int) -> int:
        return self.database.update(Statement(
            "UPDATE hook_requests SET payload = json_set(payload, '$.body.attribution.joined_callers', ?, "
            "'$.body.attribution.complete', json('true')) "
            "WHERE json_extract(payload, '$.body.attribution.client_id') = ? "
            "AND json_extract(payload, '$.body.attribution.command_id') = ? "
            "AND json_extract(payload, '$.body.attribution.person_id') = ?",
            [joined_callers, client_id, command_id, person_id]))
