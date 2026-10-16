from journal.models.entry import Entry
from journal.repositories.scoped_repository import ScopedRepository


class Entries(ScopedRepository[Entry]):
    model = Entry

    def said_to(self, session: str) -> int:
        """How many lines the journal has said to this session, counted whole: the nudge entries carrying it."""
        row = self.connection.one(f"SELECT COUNT(*) AS n FROM {self.table} WHERE environment_id = ? AND kind = 'nudge' AND json_extract(data, '$.session') = ?", (self.scope.id, session))
        return int(row["n"]) if row else 0

    def last_said(self, session: str, key: str, line: str) -> float:
        """When these words were last said to this session under this key, as the nudge entry recorded it; 0 when never."""
        row = self.connection.one(f"SELECT MAX(json_extract(data, '$.at')) AS at FROM {self.table} WHERE environment_id = ? AND kind = 'nudge' AND json_extract(data, '$.session') = ? AND json_extract(data, '$.key') = ? AND json_extract(data, '$.line') = ?", (self.scope.id, session, key, line))
        return float(row["at"] or 0.0) if row else 0.0

    def of_kind(self, kind: str, last: int = 50) -> list[Entry]:
        rows = self.connection.all(f"SELECT * FROM {self.table} WHERE environment_id = ? AND kind = ? ORDER BY id DESC LIMIT ?", (self.scope.id, kind, last))
        return [self._load(row) for row in rows]

    def of_kind_in(self, last: int = 400) -> list[Entry]:
        """The newest entries here of every kind, newest first."""
        rows = self.connection.all(f"SELECT * FROM {self.table} WHERE environment_id = ? ORDER BY id DESC LIMIT ?", (self.scope.id, last))
        return [self._load(row) for row in rows]

    def last_of_session(self, session: str) -> Entry | None:
        """The latest hook entry this session sent, which says what the agent is doing right now."""
        row = self.connection.one(f"SELECT * FROM {self.table} WHERE environment_id = ? AND actor = ? AND kind != 'nudge' ORDER BY id DESC LIMIT 1", (self.scope.id, f"agent:{session}"))
        return self._load(row) if row else None

    def last_id(self) -> int:
        row = self.connection.one(f"SELECT MAX(id) AS id FROM {self.table} WHERE environment_id = ?", (self.scope.id,))
        return row["id"] or 0

    def dispatches(self, session: str) -> list[Entry]:
        """Every dispatch of a subagent in a session, however long ago: the Agent tool's starts and finishes and the subagents' own stops, oldest first."""
        rows = self.connection.all(
            f"SELECT * FROM {self.table} WHERE environment_id = ? AND json_extract(data, '$.session_id') = ? "
            "AND (kind = 'SubagentEnded' OR (kind IN ('ToolStarting', 'ToolFinished') AND json_extract(data, '$.tool_name') IN ('Agent', 'Task'))) ORDER BY id",
            (self.scope.id, session))
        return [self._load(row) for row in rows]

    def agent_calls(self, last: int = 500) -> list[Entry]:
        """The newest dispatches of a subagent here, across every session: the Agent tool's starts, newest first."""
        rows = self.connection.all(
            f"SELECT * FROM {self.table} WHERE environment_id = ? AND kind = 'ToolStarting' AND json_extract(data, '$.tool_name') IN ('Agent', 'Task') ORDER BY id DESC LIMIT ?",
            (self.scope.id, last))
        return [self._load(row) for row in rows]

    def since(self, id: int) -> list[Entry]:
        rows = self.connection.all(f"SELECT * FROM {self.table} WHERE environment_id = ? AND id > ? ORDER BY id", (self.scope.id, id))
        return [self._load(row) for row in rows]

    def _placed(self, row: Entry) -> Entry:
        """An entry names its own environment: 0 is the project's, for what happened in none."""
        return row
