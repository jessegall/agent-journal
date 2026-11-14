import pytest

from tests.integration.support.write_turns import MAIN_AGENT_HOOK, WriteTurns

SLOW_SECONDS = 2


@pytest.fixture
def turns(journal) -> WriteTurns:
    return WriteTurns(journal)


def test_a_listener_cursor_update_in_autocommit_takes_the_turn_for_its_one_statement(turns):
    assert turns.journal.run('task make "Count the turns" --brief "A task whose events the listeners take"').code == 0
    assert max(turns.turn_statements) > 1 and 1 in turns.turn_statements, f"the command's transaction and then a cursor statement each took a turn: {turns.turn_statements}"


def test_a_page_that_only_reads_never_waits_behind_a_writer(turns):
    assert turns.answers_beside_writer("task list --environment main"), "the read waited for the write turn"


def test_the_main_agents_hook_writes_right_after_the_write_in_progress(turns):
    order = turns.hook_turn_order(4)
    assert order[0] == MAIN_AGENT_HOOK and len(order) == 5, f"the turn went in this order: {order}"


def test_a_write_that_raises_rolls_back_and_the_next_writer_starts_at_once(turns):
    assert turns.journal.run("task close 999 --outcome 'Nothing to close'").code != 0
    assert turns.is_free, "the refused write kept the turn"
    assert turns.journal.run('task make "After the refusal" --brief "Written once the turn is free"').code == 0


def test_a_savepoint_inside_a_held_transaction_uses_the_turn_it_has(turns):
    turns.savepoint_write()
    assert turns.turn_statements == [1], f"each turn handed out and its statements: {turns.turn_statements}"


def test_a_writer_turn_started_the_turn_over_a_second_is_logged_with_its_class_priority_line_and_statements(turns):
    line = 'task make "Held slowly" --brief "A write that holds the turn"'
    turns.slow_turn_run(line, SLOW_SECONDS)
    assert len(turns.slow_turns) == 1, f"slow turns logged: {turns.slow_turns}"
    assert f"held {SLOW_SECONDS:.1f} seconds by test writer at agent priority: {line}" in turns.slow_turns[0], turns.slow_turns
    assert turns.slow_turns[0].endswith(f", {turns.turn_statements[-1]} statements") and turns.turn_statements[-1] > 0, turns.slow_turns
