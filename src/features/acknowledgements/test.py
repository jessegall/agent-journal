from controllers.types import Agents
from resources.base import SYSTEM
from tests.conftest import fresh
from tests.kit import report


def test_a_hook_that_finds_the_status_as_it_was_leaves_the_agent_row_unwritten_for_a_second(monkeypatch):
    from controllers import agents as held
    from controllers.agents import PENDING, write_pending_rows
    monkeypatch.setattr(held, "KEEP_FOR", 3600.0)
    record = fresh()
    agents = Agents(record, actor=SYSTEM)
    report(record, "working", "PreToolUse")
    n = agents.by_session("claude-1").n
    path = agents.rows.path(n)
    written = path.stat().st_mtime_ns
    report(record, "working", "PostToolUse")
    assert path.stat().st_mtime_ns == written, "a second hook with the same status writes nothing"
    assert agents.load(n).data["event"] == "PostToolUse", "and what it reported is read at once"
    report(record, "idle", "Stop")
    assert (path.stat().st_mtime_ns > written, agents.rows.peek(n).data["status"]) == (True, "idle"), "a status change is written at once"
    report(record, "idle", "Notification")
    monkeypatch.setattr(held, "KEEP_FOR", 0.0)
    write_pending_rows()
    assert (PENDING.holds(record, n), agents.rows.peek(n).data["event"]) == (False, "Notification"), "the server's loop writes what a second held back"


def test_a_held_agent_row_of_a_removed_environment_is_dropped_and_never_written(monkeypatch):
    import shutil
    from controllers import agents as held
    from controllers.agents import PENDING, write_pending_rows
    monkeypatch.setattr(held, "KEEP_FOR", 3600.0)
    record = fresh()
    agents = Agents(record, actor=SYSTEM)
    report(record, "working", "PreToolUse")
    n = agents.by_session("claude-1").n
    report(record, "working", "PostToolUse")
    shutil.rmtree(record.root)
    monkeypatch.setattr(held, "KEEP_FOR", 0.0)
    write_pending_rows()
    assert (PENDING.holds(record, n), record.root.exists()) == (False, False), "the row is dropped, and nothing writes the folders of the environment back"


def test_a_handler_reads_the_agents_row_the_store_holds_and_never_a_copy_of_it(monkeypatch):
    from framework.wiring import agent_row
    from resources.base import Resource
    record = fresh()
    n = Agents(record, actor=SYSTEM).by_session("claude-1").n
    copies = []
    real = Resource.fork
    monkeypatch.setattr(Resource, "fork", lambda self: copies.append(self.n) or real(self))
    first = agent_row(record, n)
    assert (copies, agent_row(record, n) is first) == ([], True), \
        "an event reaches every handler of the journal with the agent's row, and none of them copies it, since a row that has grown large costs a deep copy each time"
