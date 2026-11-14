from engine.listener.commit.commit_listener_runner import CommitListenerRunner
from engine.query.queries import Queries
from core.modules.environments.models.environment import Environment
from engine.database.repeated_work import COMMAND_LIMIT_REPEATS, READ_LIMIT_REPEATS, READ_TEXT_LIMIT_REPEATS
import io
import subprocess

from engine.actor.actor import Actor
from engine.caller.caller import Caller
from engine.cli.console import Console
from engine.database.database import Database
from engine.database.errors.repeated_calls_error import RepeatedCallsError
from engine.database.statement import Statement
from engine.testing.stories.story_line_run import StoryLineRun
import pytest

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


def test_a_repeat_in_a_viewer_line_raises(journal, monkeypatch):

    def run(console, argv, caller, stream):
        database = console.events.table.database
        for _ in range(READ_LIMIT_REPEATS + 1):
            database.rows(REPEATED_READ)
        stream.write("{}")
        return 0

    runner = StoryLineRun(journal.home)
    monkeypatch.setattr(Console, "run", run)
    with pytest.raises(RepeatedCallsError, match="SELECT 1"):
        runner.run_as(["task", "list"], lambda container: Caller(Actor.core()), io.StringIO())


REPEATED_READ = Statement("SELECT 1")


def test_a_write_does_not_reset_the_read_counts(played):
    story = played()
    database = story.container.get(Database)
    with pytest.raises(RepeatedCallsError, match="SELECT 1"), story.repeated_work.request():
        database.rows(REPEATED_READ)
        database.update(Statement("UPDATE settings SET version = version WHERE 1 = 0"))
        database.rows(REPEATED_READ)


def test_a_per_row_read_loop_raises_even_when_each_row_has_a_different_id(played):
    story = played()
    database = story.container.get(Database)
    with pytest.raises(RepeatedCallsError, match="SELECT \\?"), story.repeated_work.request():
        for row_id in range(READ_TEXT_LIMIT_REPEATS + 1):
            database.rows(Statement("SELECT ?", [row_id]))


def test_reads_with_different_parameters_stay_within_the_loop_limit(played):
    story = played()
    database = story.container.get(Database)
    with story.repeated_work.request():
        for row_id in range(READ_TEXT_LIMIT_REPEATS):
            database.rows(Statement("SELECT ?", [row_id]))


def test_a_loop_of_query_objects_with_different_ids_still_raises(played):
    story = played()
    query = story.container.get(Queries).query(Environment)
    with pytest.raises(RepeatedCallsError, match="environments"), story.repeated_work.request():
        for row_id in range(READ_TEXT_LIMIT_REPEATS + 1):
            query.filter(id=row_id).first()


def test_a_write_returning_rows_does_not_count_as_a_repeated_read(played):
    story = played()
    database = story.container.get(Database)
    with story.repeated_work.request():
        for _ in range(2):
            database.rows(Statement("UPDATE settings SET version = version WHERE 1 = 0 RETURNING version"))


def test_a_returning_write_does_not_reset_the_read_counts(played):
    story = played()
    database = story.container.get(Database)
    with pytest.raises(RepeatedCallsError, match="SELECT 1"), story.repeated_work.request():
        database.rows(REPEATED_READ)
        database.rows(Statement("UPDATE settings SET version = version WHERE 1 = 0 RETURNING version"))
        database.rows(REPEATED_READ)


def test_a_repeat_in_a_listener_round_raises(played, monkeypatch):
    story = played()
    database = story.container.get(Database)

    def run():
        for _ in range(READ_LIMIT_REPEATS + 1):
            database.rows(REPEATED_READ)

    monkeypatch.setattr(story.container.get(CommitListenerRunner), "run", run)
    with pytest.raises(RepeatedCallsError, match="SELECT 1"):
        story.run_listeners()
