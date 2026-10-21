from datetime import datetime

from journal.models.entry import Entry
from journal.support.actor import Actor
from journal.repositories.scoped_repository import ScopedRepository


DISPATCHES = "(kind IN ('SubagentEnded', 'Idle', 'SessionStarted', 'SessionEnded') OR (kind IN ('ToolStarting', 'ToolFinished') AND json_extract(data, '$.tool_name') IN ('Agent', 'Task')))"
"""The entries that start, answer or close a subagent's dispatch."""


class Entries(ScopedRepository[Entry]):
    model = Entry

    def trim(self, newest: int, kept: int) -> int:
        return self.connection.execute("DELETE FROM entries WHERE id <= ?", (newest - kept,)).rowcount

    def last_prompt_of(self, session: str) -> datetime | None:
        rows = self.selected("kind = 'PromptSubmitted' AND actor = ? ORDER BY id DESC LIMIT 1", (Actor.agent(session).stamp,))
        return rows[0].created_at if rows else None

    def said_to(self, session: str) -> int:
        return self.counted_in("kind = 'nudge' AND json_extract(data, '$.session') = ?", (session,))

    def last_said(self, session: str, key: str, line: str) -> float:
        row = self.aggregate("COALESCE(MAX(json_extract(data, '$.at')), 0) AS at", "kind = 'nudge' AND json_extract(data, '$.session') = ? AND json_extract(data, '$.key') = ? AND json_extract(data, '$.line') = ?", (session, key, line))
        return float(row["at"])

    def last_said_of(self, session: str, key: str) -> float:
        row = self.aggregate("COALESCE(MAX(json_extract(data, '$.at')), 0) AS at", "kind = 'nudge' AND json_extract(data, '$.session') = ? AND json_extract(data, '$.key') = ?", (session, key))
        return float(row["at"])

    def tool_starts(self, session: str, last: int = 500) -> list[Entry]:
        return self.selected("kind = 'ToolStarting' AND actor = ? ORDER BY id DESC LIMIT ?", (f"agent:{session}", last))

    def said_last(self, session: str, keys: tuple[str, ...]) -> Entry | None:
        marks = ", ".join("?" for _ in keys)
        found = self.selected(f"kind = 'nudge' AND json_extract(data, '$.session') = ? AND json_extract(data, '$.key') IN ({marks}) ORDER BY id DESC LIMIT 1", (session, *keys))
        return found[0] if found else None

    def lines_said_after(self, session: str, key: str, entry_id: int) -> list[str]:
        return [e.data["line"] for e in self.selected("kind = 'nudge' AND json_extract(data, '$.session') = ? AND json_extract(data, '$.key') = ? AND id > ? ORDER BY id", (session, key, entry_id))]

    def said_count_after(self, session: str, keys: tuple[str, ...], at: float) -> int:
        marks = ", ".join("?" for _ in keys)
        return self.counted_in(f"kind = 'nudge' AND json_extract(data, '$.session') = ? AND json_extract(data, '$.key') IN ({marks}) AND json_extract(data, '$.at') > ?", (session, *keys, at))

    def last_id_of_kind(self, session: str, kind: str) -> int:
        row = self.aggregate("COALESCE(MAX(id), 0) AS id", "kind = ? AND actor = ?", (kind, f"agent:{session}"))
        return int(row["id"])

    def said_since(self, session: str, key: str) -> int:
        newest = self.aggregate("COALESCE(MAX(id), 0) AS id", "kind = 'nudge' AND json_extract(data, '$.session') = ? AND json_extract(data, '$.key') = ?", (session, key))
        return self.counted_in("kind = 'nudge' AND json_extract(data, '$.session') = ? AND id > ?", (session, int(newest["id"])))

    def of_kind(self, kind: str, last: int = 50) -> list[Entry]:
        return self.selected("kind = ? ORDER BY id DESC LIMIT ?", (kind, last))

    def of_kind_in(self, last: int = 400) -> list[Entry]:
        return self.selected("1 ORDER BY id DESC LIMIT ?", (last,))

    def of_actor(self, stamp: str, last: int = 200) -> list[Entry]:
        return self.selected_everywhere("actor = ? ORDER BY id DESC LIMIT ?", (stamp, last))

    def last_of_session(self, session: str) -> Entry | None:
        rows = self.selected("actor = ? AND kind != 'nudge' ORDER BY id DESC LIMIT 1", (f"agent:{session}",))
        return rows[0] if rows else None

    def last_id(self) -> int:
        return self.aggregate("MAX(id) AS id")["id"] or 0

    def dispatches(self, session: str) -> list[Entry]:
        return self.selected(f"json_extract(data, '$.session_id') = ? AND {DISPATCHES} ORDER BY id", (session,))

    def agent_calls(self, last: int = 500) -> list[Entry]:
        return self.selected(f"{DISPATCHES} AND kind = 'ToolStarting' ORDER BY id DESC LIMIT ?", (last,))

    def shown_since(self, id: int) -> list[Entry]:
        return self.with_project("id > ? ORDER BY id", (id,))

    def shown_recent(self, last: int) -> list[Entry]:
        return self.with_project("1 ORDER BY id DESC LIMIT ?", (last,))

    def since(self, id: int) -> list[Entry]:
        return self.selected("id > ? ORDER BY id", (id,))

    def _placed(self, row: Entry) -> Entry:
        return row
