import io
import subprocess

import pytest

from engine.database.database import Database
from engine.database.statement import Statement
from engine.cli.console import Console
from engine.caller.caller import Caller
from engine.actor.actor import Actor
from engine.listener.commit.commit_listener_runner import CommitListenerRunner
from engine.query.queries import Queries
from core.modules.environments.models.environment import Environment
from engine.database.errors.repeated_calls_error import RepeatedCallsError
from engine.database.repeated_work import COMMAND_LIMIT_REPEATS, READ_LIMIT_REPEATS, READ_TEXT_LIMIT_REPEATS
from engine.testing.stories.story_line_run import StoryLineRun

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
    story.expect_rows("repeated_calls.py" in text, "repeat_read" in text, "engine/database" not in text, "engine/query" not in text)
