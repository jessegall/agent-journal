import subprocess

import pytest

from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.cli.console import Console
from core.base.listener.commit_listener_runner import CommitListenerRunner
from core.base.query.queries import Queries
from core.modules.environments.models.environment import Environment
from core.testing.repeated_calls_error import RepeatedCallsError
from core.testing.repeated_work import READ_LIMIT_REPEATS
from core.testing.story_line_run import StoryLineRun
from server.viewer.line_route import LineRoute
from server.listener_thread import ListenerThread
from tests.stories.core.support.fixtures import MainEnvironment

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
        repeat_read(story, 3)
    assert story.repeated_work.reads[REPEATED_READ] == 2


def test_a_request_that_stays_at_the_read_limit_passes(new_story):
    repeat_read(new_story(), READ_LIMIT_REPEATS)


def test_a_write_between_two_reads_does_not_clear_the_count(new_story):
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
        for row_id in range(11):
            database.rows(Statement("SELECT ?", [row_id]))


def test_ten_reads_with_different_parameters_are_within_the_loop_limit(new_story):
    story = new_story()
    database = story.container.get(Database)
    with story.repeated_work.request():
        for row_id in range(10):
            database.rows(Statement("SELECT ?", [row_id]))


def test_a_repeat_in_a_listener_round_raises(new_story, monkeypatch):
    story = new_story()
    database = story.container.get(Database)

    def run():
        for _ in range(2):
            database.rows(REPEATED_READ)

    monkeypatch.setattr(story.container.get(CommitListenerRunner), "run", run)
    with pytest.raises(RepeatedCallsError, match="SELECT 1"):
        story.run_listeners()


def test_a_repeat_in_a_viewer_line_raises(new_story, monkeypatch):
    story = new_story(fixture=MainEnvironment)

    def run(console, argv, caller, stream):
        database = console.events.table.database
        database.rows(REPEATED_READ)
        database.rows(REPEATED_READ)
        stream.write("{}")
        return 0

    route = LineRoute(story.home, ListenerThread(lambda: None, lambda error: None))
    route.line_run = StoryLineRun(story.home)
    monkeypatch.setattr(Console, "run", run)
    with pytest.raises(RepeatedCallsError, match="SELECT 1"):
        answer = route.answer("tasks.tasks", ["task", "list"], story.user.id, "main")
        assert answer.code == 0, answer


def test_a_request_that_starts_one_command_past_the_limit_raises_and_names_the_command(new_story):
    with pytest.raises(RepeatedCallsError, match="true"):
        repeat_command(new_story(), 2)


def test_a_new_request_starts_every_count_at_zero(new_story):
    story = new_story()
    repeat_read(story, READ_LIMIT_REPEATS)
    repeat_read(story, READ_LIMIT_REPEATS)


def test_a_cached_query_reuses_rows_and_reloads_after_its_table_changes(new_story):
    story = new_story(fixture=MainEnvironment)
    database = story.container.get(Database)
    query = story.container.get(Queries).query(Environment)
    with story.repeated_work.request():
        assert query.kept_find(1).name == "main"
        assert query.kept_find(1).name == "main"
        database.update(Statement("UPDATE environments SET name = ?, version = version + 1 WHERE id = ?", ("renamed", 1)))
        assert query.kept_find(1).name == "renamed"


def test_a_cache_of_one_row_does_not_replace_a_cache_of_all_rows(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_success("environment make other /work/other")
    query = story.container.get(Queries).query(Environment).oldest()
    with story.repeated_work.request():
        assert query.kept_first().name == "main"
        assert [row.name for row in query.kept_rows()] == ["main", "other"]
