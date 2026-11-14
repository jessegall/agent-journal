import pytest

from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.ticks.row_pruning import RowPruning
from engine.database.statement import Statement
from engine.testing.examples.hook_samples import HookSamples


def count(journal, table: str) -> int:
    return journal.database.rows(Statement(f"SELECT count(*) FROM {table}"))[0][0]


@pytest.fixture
def prompted(journal):
    journal.new_row_id("agent start s-1 claude main --environment main")
    journal.hook("s-1", HookSamples.prompt("an old prompt"))
    assert count(journal, "hook_calls") > 0
    return journal


def test_rows_past_the_newest_kept_go_without_an_event_and_the_newest_stay(prompted, monkeypatch):
    prompted.hook("s-1", HookSamples.prompt("a new prompt"))
    monkeypatch.setattr(HookCall, "kept_rows", 1)
    events = count(prompted, "events")
    RowPruning()(prompted.container)
    assert count(prompted, "hook_calls") == 1 and count(prompted, "events") <= events


def test_a_hook_call_a_waiting_line_still_points_at_stays(prompted, monkeypatch):
    prompted.database.update(Statement("UPDATE agent_lines SET state = 'waiting' WHERE hook_call_id IS NOT NULL"))
    blocked = prompted.database.rows(Statement("SELECT count(DISTINCT hook_call_id) FROM agent_lines WHERE hook_call_id IS NOT NULL"))[0][0]
    monkeypatch.setattr(HookCall, "kept_rows", 0)
    RowPruning()(prompted.container)
    assert count(prompted, "hook_calls") >= blocked
