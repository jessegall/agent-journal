from journal.models.entry import Entry
from journal.repositories.scoped_repository import ScopedRepository
from journal.repositories.settings import PROJECT


DISPATCHES = "(kind IN ('SubagentEnded', 'Idle', 'SessionStarted', 'SessionEnded') OR (kind IN ('ToolStarting', 'ToolFinished') AND json_extract(data, '$.tool_name') IN ('Agent', 'Task')))"
"""The entries that start, answer or close a subagent's dispatch."""


class Entries(ScopedRepository[Entry]):
    model = Entry

    def said_to(self, session: str) -> int:
        """How many lines the journal has said to this session, counted whole: the nudge entries carrying it."""
        row = self.connection.one(f"SELECT COUNT(*) AS n FROM {self.table} WHERE environment_id = ? AND kind = 'nudge' AND json_extract(data, '$.session') = ?", (self.scope.id, session))
        return int(row["n"])

    def last_said(self, session: str, key: str, line: str) -> float:
        """When these words were last said to this session under this key, as the nudge entry recorded it; 0 when never."""
        row = self.connection.one(f"SELECT COALESCE(MAX(json_extract(data, '$.at')), 0) AS at FROM {self.table} WHERE environment_id = ? AND kind = 'nudge' AND json_extract(data, '$.session') = ? AND json_extract(data, '$.key') = ? AND json_extract(data, '$.line') = ?", (self.scope.id, session, key, line))
        return float(row["at"])

    def tool_starts(self, session: str, last: int = 500) -> list[Entry]:
        """The newest tool uses of this session, newest first, as the hooks recorded them."""
        return self.selected("environment_id = ? AND kind = 'ToolStarting' AND actor = ? ORDER BY id DESC LIMIT ?", (self.scope.id, f"agent:{session}", last))

    def said_since(self, session: str, key: str) -> int:
        """How many lines the journal said to this session since it last said the one with this key, or ever when it never did."""
        newest = self.connection.one(f"SELECT COALESCE(MAX(id), 0) AS id FROM {self.table} WHERE environment_id = ? AND kind = 'nudge' AND json_extract(data, '$.session') = ? AND json_extract(data, '$.key') = ?", (self.scope.id, session, key))
        since = int(newest["id"])
        row = self.connection.one(f"SELECT COUNT(*) AS n FROM {self.table} WHERE environment_id = ? AND kind = 'nudge' AND json_extract(data, '$.session') = ? AND id > ?", (self.scope.id, session, since))
        return int(row["n"])

    def of_kind(self, kind: str, last: int = 50) -> list[Entry]:
        return self.selected("environment_id = ? AND kind = ? ORDER BY id DESC LIMIT ?", (self.scope.id, kind, last))

    def of_kind_in(self, last: int = 400) -> list[Entry]:
        """The newest entries here of every kind, newest first."""
        return self.selected("environment_id = ? ORDER BY id DESC LIMIT ?", (self.scope.id, last))

    def of_actor(self, stamp: str, last: int = 200) -> list[Entry]:
        """The newest entries an actor left, in every environment, newest first."""
        return self.selected("actor = ? ORDER BY id DESC LIMIT ?", (stamp, last))

    def last_of_session(self, session: str) -> Entry | None:
        """The latest hook entry this session sent, which says what the agent is doing right now."""
        row = self.connection.one(f"SELECT * FROM {self.table} WHERE environment_id = ? AND actor = ? AND kind != 'nudge' ORDER BY id DESC LIMIT 1", (self.scope.id, f"agent:{session}"))
        return self._load(row) if row else None

    def last_id(self) -> int:
        row = self.connection.one(f"SELECT MAX(id) AS id FROM {self.table} WHERE environment_id = ?", (self.scope.id,))
        return row["id"] or 0

    def dispatches(self, session: str) -> list[Entry]:
        """Every dispatch of a subagent in a session, however long ago: the Agent tool's starts and finishes, the subagents' own stops and the turn and session ends that close what never answered, oldest first."""
        return self.selected(f"environment_id = ? AND json_extract(data, '$.session_id') = ? AND {DISPATCHES} ORDER BY id", (self.scope.id, session))

    def agent_calls(self, last: int = 500) -> list[Entry]:
        """The newest dispatches of a subagent here, across every session: the Agent tool's starts, newest first."""
        return self.selected("environment_id = ? AND kind = 'ToolStarting' AND json_extract(data, '$.tool_name') IN ('Agent', 'Task') ORDER BY id DESC LIMIT ?", (self.scope.id, last))

    def shown_since(self, id: int) -> list[Entry]:
        """What the viewer is told of after an id: this environment's entries and the project's, such as a check run or a plugin changed."""
        return self.selected("environment_id IN (?, ?) AND id > ? ORDER BY id", (self.scope.id, PROJECT, id))

    def shown_recent(self, last: int) -> list[Entry]:
        """The newest entries the viewer is told of, this environment's and the project's, newest first."""
        return self.selected("environment_id IN (?, ?) ORDER BY id DESC LIMIT ?", (self.scope.id, PROJECT, last))

    def since(self, id: int) -> list[Entry]:
        return self.selected("environment_id = ? AND id > ? ORDER BY id", (self.scope.id, id))

    def _placed(self, row: Entry) -> Entry:
        """An entry names its own environment: 0 is the project's, for what happened in none."""
        return row
