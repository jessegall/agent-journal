from datetime import datetime

from journal.models.entry import Entry
from journal.support.actor import Actor
from journal.repositories.scoped_repository import ScopedRepository


DISPATCHES = "(kind IN ('SubagentEnded', 'Stop', 'SessionStarted', 'SessionEnded') OR (kind IN ('ToolStarting', 'ToolFinished', 'ToolFailed') AND json_extract(data, '$.tool_name') IN ('Agent', 'Task', 'SendMessage')))"


class Entries(ScopedRepository[Entry]):
    model = Entry

    def trim(self, newest: int, stored: int) -> int:
        return self.connection.execute("DELETE FROM entries WHERE id <= ?", (newest - stored,)).rowcount

    def last_prompt(self, session: str) -> datetime | None:
        rows = self.selected("kind = 'PromptSubmitted' AND actor = ? ORDER BY id DESC LIMIT 1", (Actor.agent(session).stamp,))
        return rows[0].created_at if rows else None

    def agent_lines(self, session: str) -> int:
        return self.count("kind = 'nudge' AND json_extract(data, '$.session') = ?", (session,))

    def last_line(self, session: str, key: str, line: str) -> float:
        row = self.aggregate("COALESCE(MAX(json_extract(data, '$.time')), 0) AS time", "kind = 'nudge' AND json_extract(data, '$.session') = ? AND json_extract(data, '$.key') = ? AND json_extract(data, '$.line') = ?", (session, key, line))
        return float(row["time"])

    def last_lines(self, session: str, key: str) -> float:
        row = self.aggregate("COALESCE(MAX(json_extract(data, '$.time')), 0) AS time", "kind = 'nudge' AND json_extract(data, '$.session') = ? AND json_extract(data, '$.key') = ?", (session, key))
        return float(row["time"])

    def tool_starts(self, session: str, last: int = 500) -> list[Entry]:
        return self.selected("kind = 'ToolStarting' AND actor = ? ORDER BY id DESC LIMIT ?", (f"agent:{session}", last))

    def last_line_entry(self, session: str, keys: tuple[str, ...]) -> Entry | None:
        thresholds = ", ".join("?" for _ in keys)
        rows = self.selected(f"kind = 'nudge' AND json_extract(data, '$.session') = ? AND json_extract(data, '$.key') IN ({thresholds}) ORDER BY id DESC LIMIT 1", (session, *keys))
        return rows[0] if rows else None

    def recent_lines(self, session: str, key: str, entry_id: int) -> list[str]:
        return [e.data["line"] for e in self.selected("kind = 'nudge' AND json_extract(data, '$.session') = ? AND json_extract(data, '$.key') = ? AND id > ? ORDER BY id", (session, key, entry_id))]

    def use_lines(self, session: str, key: str, tool_use: int) -> list[str]:
        return [e.data["line"] for e in self.selected("kind = 'nudge' AND json_extract(data, '$.session') = ? AND json_extract(data, '$.key') = ? AND json_extract(data, '$.tool_use') > ? ORDER BY id", (session, key, tool_use))]

    def nudge_count(self, session: str, keys: tuple[str, ...], tool_use: int) -> int:
        placeholders = ", ".join("?" for _ in keys)
        return self.count(f"kind = 'nudge' AND json_extract(data, '$.session') = ? AND json_extract(data, '$.key') IN ({placeholders}) AND json_extract(data, '$.tool_use') >= ?", (session, *keys, tool_use))

    def last_kind_id(self, session: str, kind: str) -> int:
        row = self.aggregate("COALESCE(MAX(id), 0) AS id", "kind = ? AND actor = ?", (kind, f"agent:{session}"))
        return int(row["id"])

    def recent_line_entries(self, session: str, key: str) -> int:
        newest = self.aggregate("COALESCE(MAX(id), 0) AS id", "kind = 'nudge' AND json_extract(data, '$.session') = ? AND json_extract(data, '$.key') = ?", (session, key))
        return self.count("kind = 'nudge' AND json_extract(data, '$.session') = ? AND id > ?", (session, int(newest["id"])))

    def kind_entries(self, kind: str, last: int = 50) -> list[Entry]:
        return self.selected("kind = ? ORDER BY id DESC LIMIT ?", (kind, last))

    def kind_entries_scoped(self, last: int = 400) -> list[Entry]:
        return self.selected("1 ORDER BY id DESC LIMIT ?", (last,))

    def actor_entries(self, stamp: str, last: int = 200) -> list[Entry]:
        return self.selected_globally("actor = ? ORDER BY id DESC LIMIT ?", (stamp, last))

    def last_session_entry(self, session: str) -> Entry | None:
        rows = self.selected("actor = ? AND kind != 'nudge' ORDER BY id DESC LIMIT 1", (f"agent:{session}",))
        return rows[0] if rows else None

    def last_id(self) -> int:
        return self.aggregate("MAX(id) AS id")["id"] or 0

    def dispatches(self, session: str) -> list[Entry]:
        return self.selected(f"json_extract(data, '$.session_id') = ? AND {DISPATCHES} ORDER BY id", (session,))

    def agent_calls(self, last: int = 500) -> list[Entry]:
        return self.selected(f"{DISPATCHES} AND kind = 'ToolStarting' ORDER BY id DESC LIMIT ?", (last,))

    def recent_shown(self, id: int) -> list[Entry]:
        return self.with_project("id > ? ORDER BY id", (id,))

    def shown_recent(self, last: int) -> list[Entry]:
        return self.with_project("1 ORDER BY id DESC LIMIT ?", (last,))

    def recent(self, id: int) -> list[Entry]:
        return self.selected("id > ? ORDER BY id", (id,))

    def _placed(self, row: Entry) -> Entry:
        return row
