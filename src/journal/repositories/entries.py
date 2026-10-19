from journal.models.entry import Entry
from journal.repositories.scoped_repository import ScopedRepository


DISPATCHES = "(kind IN ('SubagentEnded', 'Idle', 'SessionStarted', 'SessionEnded') OR (kind IN ('ToolStarting', 'ToolFinished') AND json_extract(data, '$.tool_name') IN ('Agent', 'Task')))"
"""The entries that start, answer or close a subagent's dispatch."""


class Entries(ScopedRepository[Entry]):
    model = Entry

    def said_to(self, session: str) -> int:
        """How many lines the journal has said to this session, counted whole: the nudge entries carrying it."""
        return self.counted_in("kind = 'nudge' AND json_extract(data, '$.session') = ?", (session,))

    def last_said(self, session: str, key: str, line: str) -> float:
        """When these words were last said to this session under this key, as the nudge entry recorded it; 0 when never."""
        row = self.aggregate("COALESCE(MAX(json_extract(data, '$.at')), 0) AS at", "kind = 'nudge' AND json_extract(data, '$.session') = ? AND json_extract(data, '$.key') = ? AND json_extract(data, '$.line') = ?", (session, key, line))
        return float(row["at"])

    def tool_starts(self, session: str, last: int = 500) -> list[Entry]:
        """The newest tool uses of this session, newest first, as the hooks recorded them."""
        return self.selected("kind = 'ToolStarting' AND actor = ? ORDER BY id DESC LIMIT ?", (f"agent:{session}", last))

    def said_since(self, session: str, key: str) -> int:
        """How many lines the journal said to this session since it last said the one with this key, or ever when it never did."""
        newest = self.aggregate("COALESCE(MAX(id), 0) AS id", "kind = 'nudge' AND json_extract(data, '$.session') = ? AND json_extract(data, '$.key') = ?", (session, key))
        return self.counted_in("kind = 'nudge' AND json_extract(data, '$.session') = ? AND id > ?", (session, int(newest["id"])))

    def of_kind(self, kind: str, last: int = 50) -> list[Entry]:
        return self.selected("kind = ? ORDER BY id DESC LIMIT ?", (kind, last))

    def of_kind_in(self, last: int = 400) -> list[Entry]:
        """The newest entries here of every kind, newest first."""
        return self.selected("1 ORDER BY id DESC LIMIT ?", (last,))

    def of_actor(self, stamp: str, last: int = 200) -> list[Entry]:
        """The newest entries an actor left, in every environment, newest first."""
        return self.selected_everywhere("actor = ? ORDER BY id DESC LIMIT ?", (stamp, last))

    def last_of_session(self, session: str) -> Entry | None:
        """The latest hook entry this session sent, which says what the agent is doing right now."""
        rows = self.selected("actor = ? AND kind != 'nudge' ORDER BY id DESC LIMIT 1", (f"agent:{session}",))
        return rows[0] if rows else None

    def last_id(self) -> int:
        return self.aggregate("MAX(id) AS id")["id"] or 0

    def dispatches(self, session: str) -> list[Entry]:
        """Every dispatch of a subagent in a session, however long ago: the Agent tool's starts and finishes, the subagents' own stops and the turn and session ends that close what never answered, oldest first."""
        return self.selected(f"json_extract(data, '$.session_id') = ? AND {DISPATCHES} ORDER BY id", (session,))

    def agent_calls(self, last: int = 500) -> list[Entry]:
        """The newest dispatches of a subagent here, across every session: the Agent tool's starts, newest first, read through the index of the dispatches."""
        return self.selected(f"{DISPATCHES} AND kind = 'ToolStarting' ORDER BY id DESC LIMIT ?", (last,))

    def shown_since(self, id: int) -> list[Entry]:
        """What the viewer is told of after an id: this environment's entries and the project's, such as a check run or a plugin changed."""
        return self.with_project("id > ? ORDER BY id", (id,))

    def shown_recent(self, last: int) -> list[Entry]:
        """The newest entries the viewer is told of, this environment's and the project's, newest first."""
        return self.with_project("1 ORDER BY id DESC LIMIT ?", (last,))

    def since(self, id: int) -> list[Entry]:
        return self.selected("id > ? ORDER BY id", (id,))

    def _placed(self, row: Entry) -> Entry:
        """An entry names its own environment: 0 is the project's, for what happened in none."""
        return row
