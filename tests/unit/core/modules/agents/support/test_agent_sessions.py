from contextlib import contextmanager
from dataclasses import replace
from types import SimpleNamespace

from core.modules.agents.support.agent_sessions import AgentSessions

CONTEXT = SimpleNamespace()
CACHE_PASSED = SimpleNamespace(value="cache_passed")
FINISHED = SimpleNamespace(value="finished")


class FakeSessionQuery:
    """The stored session rows, read the way the history reads them."""

    def __init__(self, rows: list) -> None:
        self.rows = rows

    def filter(self, **columns: object) -> "FakeSessionQuery":
        return FakeSessionQuery([row for row in self.rows if all(getattr(row, name) == value for name, value in columns.items())])

    def descending(self, column: str) -> "FakeSessionQuery":
        return FakeSessionQuery(sorted(self.rows, key=lambda row: getattr(row, column), reverse=True))

    def oldest(self) -> "FakeSessionQuery":
        return FakeSessionQuery(sorted(self.rows, key=lambda row: row.id))

    def page(self, number: int, size: int) -> "FakeSessionQuery":
        return FakeSessionQuery(self.rows[:size])

    def first(self):
        return self.rows[0] if self.rows else None


class FakeStore:
    """Keeps session rows in a list and gives each new row the next id."""

    def __init__(self) -> None:
        self.rows: list = []

    def query(self, model: type) -> FakeSessionQuery:
        return FakeSessionQuery(self.rows)

    def save(self, row, context):
        saved = replace(row, id=len(self.rows) + 1)
        self.rows.append(saved)
        return saved

    def update(self, stored, context, **values: object):
        changed = replace(stored, **values)
        self.rows[self.rows.index(stored)] = changed
        return changed


class FakeScopes:
    @contextmanager
    def opened(self, actor_id: int | None, disabled: list):
        yield


class FakeClock:
    def __init__(self) -> None:
        self.ticks = 0

    def timestamp(self) -> str:
        self.ticks += 1
        return f"2026-11-11T09:00:0{self.ticks}"


def agent(session: str, program: str = "claude") -> SimpleNamespace:
    return SimpleNamespace(id=4, session=session, program=program, program_model="sonnet")


def sessions_with_store() -> tuple[AgentSessions, FakeStore]:
    store = FakeStore()
    return AgentSessions(store, store, FakeScopes(), FakeClock()), store


def test_a_started_agent_has_one_open_row_for_its_session():
    sessions, store = sessions_with_store()
    sessions.started(agent("s-1"), CONTEXT)
    assert [(row.session_agent_id, row.session, row.program, row.program_model, row.ended_at, row.end_reason) for row in store.rows] == [(4, "s-1", "claude", "sonnet", None, "")]


def test_a_replacement_closes_the_old_row_with_its_reason_and_opens_the_new_one():
    sessions, store = sessions_with_store()
    sessions.started(agent("s-1"), CONTEXT)
    sessions.replaced(agent("s-2", "codex"), CACHE_PASSED, CONTEXT)
    assert [(row.session, row.program, bool(row.ended_at), row.end_reason) for row in sessions.history(4, 50)] == [("s-1", "claude", True, "cache_passed"), ("s-2", "codex", False, "")]
    assert sessions.current(4).session == "s-2"


def test_an_end_closes_only_a_row_that_is_still_open_and_a_reopening_clears_it():
    sessions, store = sessions_with_store()
    sessions.started(agent("s-1"), CONTEXT)
    sessions.ended(4, CACHE_PASSED, CONTEXT)
    sessions.ended(4, FINISHED, CONTEXT)
    assert sessions.current(4).end_reason == "cache_passed"
    sessions.reopened(4, CONTEXT)
    assert (sessions.current(4).ended_at, sessions.current(4).end_reason) == (None, "")


def test_binding_a_placeholder_session_changes_its_row_and_adds_none():
    sessions, store = sessions_with_store()
    sessions.started(agent("placeholder"), CONTEXT)
    sessions.bound("placeholder", "s-real", CONTEXT)
    assert [row.session for row in store.rows] == ["s-real"]


def test_an_older_session_names_its_agent_as_replaced_and_the_current_and_an_unknown_one_name_none():
    sessions, store = sessions_with_store()
    sessions.started(agent("s-1"), CONTEXT)
    sessions.replaced(agent("s-2"), CACHE_PASSED, CONTEXT)
    assert [sessions.replaced_agent_id(session) for session in ("s-1", "s-2", "s-9")] == [agent("s-1").id, None, None]
