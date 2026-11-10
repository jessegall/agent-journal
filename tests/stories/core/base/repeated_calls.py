import io
import subprocess

import pytest

from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.cli.console import Console
from engine.caller.caller import Caller
from engine.actor.actor import Actor
from core.base.listener.commit_listener_runner import CommitListenerRunner
from engine.query.queries import Queries
from core.modules.environments.models.environment import Environment
from core.base.database.repeated_calls_error import RepeatedCallsError
from core.base.database.repeated_work import COMMAND_LIMIT_REPEATS, READ_LIMIT_REPEATS, READ_TEXT_LIMIT_REPEATS
from core.testing.story_line_run import StoryLineRun

REPEATED_READ = Statement("SELECT 1")


def repeat_read(story, count: int) -> None:
    database = story.container.get(Database)
    with story.repeated_work.request():
        for _ in range(count):
            database.rows(REPEATED_READ)


def repeat_command(story, count: int) -> None:
    with story.repeated_work.request():
        for _ in range(count):
            subprocess.run(["true"], check=True)


def test_a_request_that_repeats_one_read_past_the_limit_raises_and_names_the_read(new_story):
    story = new_story()
    with pytest.raises(RepeatedCallsError, match="SELECT 1"):
        repeat_read(story, READ_LIMIT_REPEATS + 2)
    story.expect_rows(story.repeated_work.reads[REPEATED_READ] == READ_LIMIT_REPEATS + 1)


def test_a_request_that_stays_at_the_read_limit_passes(new_story):
    repeat_read(new_story(), READ_LIMIT_REPEATS)


def test_a_second_read_is_refused(new_story):
    story = new_story()
    with pytest.raises(RepeatedCallsError, match="more than 1 times"):
        repeat_read(story, 2)


def test_a_write_does_not_reset_the_read_counts(new_story):
    story = new_story()
    database = story.container.get(Database)
    with pytest.raises(RepeatedCallsError, match="SELECT 1"), story.repeated_work.request():
        database.rows(REPEATED_READ)
        database.update(Statement("UPDATE settings SET version = version WHERE 1 = 0"))
        database.rows(REPEATED_READ)


def test_a_per_row_read_loop_raises_even_when_each_row_has_a_different_id(new_story):
    story = new_story()
    database = story.container.get(Database)
    with pytest.raises(RepeatedCallsError, match="SELECT \\?"), story.repeated_work.request():
        for row_id in range(READ_TEXT_LIMIT_REPEATS + 1):
            database.rows(Statement("SELECT ?", [row_id]))


def test_reads_with_different_parameters_stay_within_the_loop_limit(new_story):
    story = new_story()
    database = story.container.get(Database)
    with story.repeated_work.request():
        for row_id in range(READ_TEXT_LIMIT_REPEATS):
            database.rows(Statement("SELECT ?", [row_id]))


def test_a_loop_of_query_objects_with_different_ids_still_raises(new_story):
    story = new_story()
    query = story.container.get(Queries).query(Environment)
    with pytest.raises(RepeatedCallsError, match="environments"), story.repeated_work.request():
        for row_id in range(READ_TEXT_LIMIT_REPEATS + 1):
            query.filter(id=row_id).first()


def test_a_write_returning_rows_does_not_count_as_a_repeated_read(new_story):
    story = new_story()
    database = story.container.get(Database)
    with story.repeated_work.request():
        for _ in range(2):
            database.rows(Statement("UPDATE settings SET version = version WHERE 1 = 0 RETURNING version"))


def test_a_returning_write_does_not_reset_the_read_counts(new_story):
    story = new_story()
    database = story.container.get(Database)
    with pytest.raises(RepeatedCallsError, match="SELECT 1"), story.repeated_work.request():
        database.rows(REPEATED_READ)
        database.rows(Statement("UPDATE settings SET version = version WHERE 1 = 0 RETURNING version"))
        database.rows(REPEATED_READ)


def test_a_repeat_in_a_listener_round_raises(new_story, monkeypatch):
    story = new_story()
    database = story.container.get(Database)

    def run():
        for _ in range(READ_LIMIT_REPEATS + 1):
            database.rows(REPEATED_READ)

    monkeypatch.setattr(story.container.get(CommitListenerRunner), "run", run)
    with pytest.raises(RepeatedCallsError, match="SELECT 1"):
        story.run_listeners()


def test_a_repeat_in_a_viewer_line_raises(new_story, monkeypatch):
    story = new_story()

    def run(console, argv, caller, stream):
        database = console.events.table.database
        for _ in range(READ_LIMIT_REPEATS + 1):
            database.rows(REPEATED_READ)
        stream.write("{}")
        return 0

    runner = StoryLineRun(story.home)
    monkeypatch.setattr(Console, "run", run)
    with pytest.raises(RepeatedCallsError, match="SELECT 1"):
        runner.run_as(["task", "list"], lambda container: Caller(Actor.core()), io.StringIO())


def test_a_request_that_starts_one_command_past_the_limit_raises_and_names_the_command(new_story):
    with pytest.raises(RepeatedCallsError, match="true"):
        repeat_command(new_story(), COMMAND_LIMIT_REPEATS + 1)


def test_a_new_request_starts_every_count_at_zero(new_story):
    story = new_story()
    repeat_read(story, READ_LIMIT_REPEATS)
    repeat_read(story, READ_LIMIT_REPEATS)




def test_a_repeat_names_the_code_that_asked_not_the_layers_between(new_story):
    story = new_story()
    with pytest.raises(RepeatedCallsError) as raised:
        repeat_read(story, 2)
    text = str(raised.value)
    story.expect_rows("repeated_calls.py" in text, "repeat_read" in text, "core/base/database" not in text, "engine/query" not in text)
