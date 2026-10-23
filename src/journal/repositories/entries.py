from datetime import datetime

from journal.db.query import Query
from journal.models.entry import Entry
from journal.support.actor import Actor
from journal.repositories.scoped_repository import ScopedRepository
from journal.support.agent_message import AgentMessage
from journal.support.subagent_dispatch import SubagentDispatch


ENTRIES = Query.build(Entry)
DISPATCHES = ENTRIES.filter_alternatives(
    ENTRIES.filter_listed("kind", ("SubagentStarted", "SubagentEnded", "Stop", "SessionStarted", "SessionEnded", "TurnFailed")),
    ENTRIES.filter_listed("kind", ("ToolStarting", "ToolFinished", "ToolFailed")).filter_listed("data->call->operation->kind", (SubagentDispatch.kind, AgentMessage.kind)),
    ENTRIES.filter(kind="PromptSubmitted").filter_prefix("data->prompt", "<task-notification>"),
).inlined()
NUDGE = "nudge"


class Entries(ScopedRepository[Entry]):
    model = Entry

    def trim(self, newest: int, stored: int) -> None:
        self._purged(self.query().filter_less_equal("id", newest - stored).filter_unequal("kind", NUDGE))

    def trim_lines(self, stored: int) -> None:
        for boundary in self.selected_globally(self.query().filter(kind=NUDGE).order_descending("id").limit(1).offset(stored)):
            self._purged(self.query().filter(kind=NUDGE).filter_less_equal("id", boundary.row_id))

    def last_prompt(self, session: str) -> datetime | None:
        rows = self.selected(self.query().filter(kind="PromptSubmitted", actor=Actor.agent(session)).order_descending("id").limit(1))
        return rows[0].created_at if rows else None

    def agent_lines(self, session: str) -> int:
        return self.counted(self.lines(session))

    def last_line(self, session: str, key: str, line: str) -> float:
        return float(self.maximum(self.lines(session).filter_json("data->key", key).filter_json("data->line", line), "data->time", 0))

    def last_lines(self, session: str, key: str) -> float:
        return float(self.maximum(self.lines(session).filter_json("data->key", key), "data->time", 0))

    def tool_starts(self, session: str, last: int = 500) -> list[Entry]:
        return self.selected(self.query().filter(kind="ToolStarting", actor=Actor.agent(session)).order_descending("id").limit(last))

    def output_tool_starts(self, session: str, last: int = 500) -> list[Entry]:
        mentions = self.query().filter_alternatives(self.query().filter_containing("data", "outputs/"), self.query().filter_containing("data", "journal output read "))
        return self.selected(mentions.filter(kind="ToolStarting", actor=Actor.agent(session)).order_descending("id").limit(last))

    def shape_commands(self, session: str, shape: str, last: int = 200) -> set[str]:
        rows = self.selected(self.query().filter(kind="ToolStarting", actor=Actor.agent(session)).filter_json("data->call->shape", shape).order_descending("id").limit(last))
        return {row.recorded_call().command for row in rows}

    def shape_count(self, session: str, shape: str, last: int = 200) -> int:
        return len(self.selected(self.query().filter(kind="ToolStarting", actor=Actor.agent(session)).filter_json("data->call->shape", shape).order_descending("id").limit(last)))

    def newer_shell_starts(self, session: str, earliest: datetime, last: int = 500) -> list[Entry]:
        shell = self.query().filter(kind="ToolStarting", actor=Actor.agent(session)).filter_present("data->call->command").filter_unequal("data->call->command", "")
        return self.selected(shell.filter_greater("created_at", earliest).order_descending("id").limit(last))

    def newer_tool_ends(self, session: str, earliest: datetime, last: int = 500) -> list[Entry]:
        return self.selected(self.query().filter_listed("kind", ("ToolFinished", "ToolFailed")).filter(actor=Actor.agent(session)).filter_greater("created_at", earliest).order_descending("id").limit(last))

    def newer_kind_entries(self, kind: str, earliest: datetime, last: int = 50) -> list[Entry]:
        return self.selected(self.query().filter(kind=kind).filter_greater("created_at", earliest).order_descending("id").limit(last))

    def newer_session_entries(self, kind: str, session: str, earliest: datetime, last: int = 50) -> list[Entry]:
        return [entry for entry in self.newer_kind_entries(kind, earliest, last) if entry.is_session(session)]

    def open_moves(self, moved: str, ended: str) -> list[Entry]:
        chains = {entry.data["chain"] for entry in self.kind_entries(ended, 50)}
        return [entry for entry in reversed(self.kind_entries(moved, 50)) if entry.data["chain"] not in chains]

    def session_scoped_entries(self, session: str, last: int) -> list[Entry]:
        return [entry for entry in reversed(self.kind_entries_scoped(last)) if entry.is_session(session)]

    def session_kind_entries(self, kind: str, session: str) -> list[Entry]:
        return [entry for entry in self.kind_entries(kind) if entry.is_session(session)]

    def line_entries(self, session: str, line: str) -> list[Entry]:
        return self.selected(self.lines(session).filter_json("data->line", line).order("id"))

    def session_moves(self, kinds: tuple[str, ...], session: str, last: int = 200) -> list[Entry]:
        return [entry for entry in self.kind_entries_scoped(last) if entry.kind in kinds and entry.actor and entry.actor.id == session]

    def tool_ends(self, session: str, last: int = 500) -> list[Entry]:
        return self.selected(self.query().filter_listed("kind", ("ToolFinished", "ToolFailed")).filter(actor=Actor.agent(session)).order_descending("id").limit(last))

    def last_line_entry(self, session: str, keys: tuple[str, ...]) -> Entry | None:
        rows = self.selected(self.lines(session).filter_listed("data->key", keys).order_descending("id").limit(1))
        return rows[0] if rows else None

    def line_entries(self, session: str, keys: tuple[str, ...], last: int = 100) -> list[Entry]:
        return self.selected(self.lines(session).filter_listed("data->key", keys).order_descending("id").limit(last))

    def recent_lines(self, session: str, key: str, entry_id: int) -> list[str]:
        return [e.data["line"] for e in self.selected(self.lines(session).filter_json("data->key", key).filter_greater("id", entry_id).order("id"))]

    def use_lines(self, session: str, key: str, tool_use: int) -> list[str]:
        return [e.data["line"] for e in self.selected(self.lines(session).filter_json("data->key", key).filter_greater("data->tool_use", tool_use).order("id"))]

    def nudge_count(self, session: str, keys: tuple[str, ...], tool_use: int) -> int:
        return self.counted(self.lines(session).filter_listed("data->key", keys).filter_greater_equal("data->tool_use", tool_use))

    def last_kind_id(self, session: str, kind: str) -> int:
        return self.maximum(self.query().filter(kind=kind, actor=Actor.agent(session)), "id", 0)

    def recent_line_entries(self, session: str, key: str) -> int:
        newest = self.maximum(self.lines(session).filter_json("data->key", key), "id", 0)
        return self.counted(self.lines(session).filter_greater("id", newest))

    def kind_entries(self, kind: str, last: int = 50) -> list[Entry]:
        return self.selected(self.query().filter(kind=kind).order_descending("id").limit(last))

    def undelivered_lines(self, kind: str, session: str) -> list[Entry]:
        return [entry for entry in self.selected(self.query().filter(kind=kind).filter_json("data->session", session).order_descending("id").limit(200)) if not entry.data.get("delivered")]

    def kind_entries_scoped(self, last: int = 400) -> list[Entry]:
        return self.selected(self.query().order_descending("id").limit(last))

    def actor_entries(self, stamp: str, last: int = 200) -> list[Entry]:
        return self.selected_globally(self.query().filter(actor=stamp).order_descending("id").limit(last))

    def last_session_entry(self, session: str) -> Entry | None:
        rows = self.selected(self.query().filter(actor=Actor.agent(session)).filter_unequal("kind", NUDGE).order_descending("id").limit(1))
        return rows[0] if rows else None

    def last_id(self) -> int:
        return self.maximum(self.query(), "id", 0)

    def dispatches(self, session: str) -> list[Entry]:
        return self.selected(DISPATCHES.filter_json("data->session_id", session).order("id"))

    def subagent_ends(self, session: str, subagent: str) -> list[Entry]:
        return self.selected(ENTRIES.filter(kind="SubagentEnded").filter_json("data->session_id", session).filter_json("data->agent_id", subagent).order("id"))

    def global_dispatches(self) -> list[Entry]:
        return self.selected_globally(DISPATCHES.order("id"))

    def agent_calls(self, last: int = 500) -> list[Entry]:
        return self.selected(DISPATCHES.filter(kind="ToolStarting").order_descending("id").limit(last))

    def recent_shown(self, id: int) -> list[Entry]:
        return self.with_project(self.query().filter_greater("id", id).order("id"))

    def shown_recent(self, last: int) -> list[Entry]:
        return self.with_project(self.query().order_descending("id").limit(last))

    def recent(self, id: int) -> list[Entry]:
        return self.selected(self.query().filter_greater("id", id).order("id"))

    def key_lines(self, key: str) -> list[str]:
        return [str(entry.data["line"]) for entry in self.selected(self.query().filter(kind=NUDGE).filter_json("data->key", key))]

    def lines(self, session: str) -> Query:
        return self.query().filter(kind=NUDGE).filter_json("data->session", session)

    def _placed(self, row: Entry) -> Entry:
        return row

    def clear(self) -> None:
        self._purged(self.query())
