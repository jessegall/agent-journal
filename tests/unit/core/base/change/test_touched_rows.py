from core.base.change.logged_event import LoggedEvent
from core.base.change.touched_rows import TouchedRows
from engine.time.timestamp import Timestamp


def logged(name: str, row_id: int) -> LoggedEvent:
    return LoggedEvent(1, name, name.split(".")[0], row_id, None, 1, "", None, frozenset(), Timestamp.parsed("2026-11-02T12:00:00.000000+00:00"), {})


def test_each_kind_of_change_has_its_line_in_a_fixed_order():
    events = [logged("task.delete", 6), logged("message.update", 4), logged("message.create", 1), logged("plan.create", 3)]
    assert TouchedRows.built(events).lines() == ["created: message:1, plan:3", "updated: message:4", "deleted: task:6"]


def test_a_named_move_on_a_row_counts_as_an_update():
    assert TouchedRows.built([logged("task.close", 5)]).lines() == ["updated: task:5"]


def test_a_row_made_and_changed_by_one_command_is_only_created():
    assert TouchedRows.built([logged("task.create", 5), logged("task.update", 5), logged("task.start", 5)]).lines() == ["created: task:5"]


def test_a_row_changed_and_then_deleted_is_only_deleted():
    assert TouchedRows.built([logged("task.update", 5), logged("task.delete", 5)]).lines() == ["deleted: task:5"]


def test_a_row_changed_twice_is_named_once():
    assert TouchedRows.built([logged("task.update", 5), logged("task.update", 5)]).lines() == ["updated: task:5"]


def test_no_change_has_no_lines():
    assert TouchedRows.built([]).lines() == []
