import json

import pytest

from engine.testing.stories.story_write_turns import MAIN_AGENT_HOOK, StoryWriteTurns
from tests.stories.core.modules.developer.support.hook_recording_fixture import HookRecordingEnabled
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story, viewer_answer

SLOW_SECONDS = 2


@pytest.fixture
def turns(new_story) -> StoryWriteTurns:
    return StoryWriteTurns(new_story(fixture=UserJoined))


def test_a_listener_cursor_update_in_autocommit_takes_the_turn_for_its_one_statement(turns):
    turns.story.expect_success('task make "Count the turns" --brief "A task whose events the listeners take" --environment main', actor=turns.story.agent)
    turns.story.expect_rows(max(turns.turn_statements) > 1, 1 in turns.turn_statements,
                            detail=f"the command's transaction and then a cursor statement each took a turn: {turns.turn_statements}")


def test_a_page_that_only_reads_never_waits_behind_a_writer(turns):
    turns.story.expect_rows(turns.answers_beside_writer("task list --environment main"), detail="the read waited for the write turn")


def test_the_main_agents_hook_writes_right_after_the_write_in_progress(turns):
    order = turns.hook_turn_order(4)
    turns.story.expect_rows(order[0] == MAIN_AGENT_HOOK, len(order) == 5, detail=f"the turn went in this order: {order}")


def test_a_write_that_raises_rolls_back_and_the_next_writer_starts_at_once(turns):
    turns.story.expect_refusal("task close 999 --outcome 'Nothing to close' --environment main", "", actor=turns.story.agent)
    turns.story.expect_rows(turns.is_free, detail="the refused write kept the turn")
    turns.story.expect_success('task make "After the refusal" --brief "Written once the turn is free" --environment main', actor=turns.story.agent)


def test_a_savepoint_inside_a_held_transaction_uses_the_turn_it_has(turns):
    turns.transaction_run('task make "Inside one transaction" --brief "Its command runs in a savepoint" --environment main')
    turns.story.expect_rows(len(turns.turn_statements) == 1, turns.turn_statements[0] > 0,
                            detail=f"each turn handed out and its statements: {turns.turn_statements}")


def test_a_writer_turn_started_the_turn_over_a_second_is_logged_with_its_class_priority_line_and_statements(turns):
    line = 'task make "Held slowly" --brief "A write that holds the turn" --environment main'
    turns.slow_turn_run(line, SLOW_SECONDS)
    turns.story.expect_rows(len(turns.slow_turns) == 1, detail=f"slow turns logged: {turns.slow_turns}")
    turns.story.expect_rows(f"held {SLOW_SECONDS:.1f} seconds by story at agent priority: {line}" in turns.slow_turns[0],
                            turns.slow_turns[0].endswith(f", {turns.turn_statements[-1]} statements"), turns.turn_statements[-1] > 0)


def test_with_the_request_log_on_and_the_database_busy_trace_rows_are_kept_for_the_tick(new_story):
    with server_story(new_story(fixture=HookRecordingEnabled), listener_thread_started=False) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        with server.story.busy_database():
            server.viewer_line_value(cookie, {"window": "tasks.tasks", "environment": "main", "line": ["task", "list"]})
        status_code, _, text = viewer_answer(server.viewer_port(), "/api/request-log-status", cookie, "")
        status = json.loads(text)
        server.story.expect_rows(status_code == 200, status["recorded"] >= 1, status["dropped"] == 0, detail=text)
        server.story.run_tick("request trace import")
        server.story.run_tick("request trace import")
        server.story.expect_text("developer hook-requests", "task list", actor=server.story.user)
