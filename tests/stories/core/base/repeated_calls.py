import subprocess

import pytest

from core.base.database.database import Database
from core.base.database.statement import Statement
from core.testing.repeated_calls_error import RepeatedCallsError
from core.testing.repeated_work import COMMAND_LIMIT_REPEATS, READ_LIMIT_REPEATS

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
    with pytest.raises(RepeatedCallsError, match="SELECT 1"):
        repeat_read(new_story(), READ_LIMIT_REPEATS + 1)


def test_a_request_that_stays_at_the_read_limit_passes(new_story):
    repeat_read(new_story(), READ_LIMIT_REPEATS)


def test_a_write_between_two_reads_starts_the_count_again(new_story):
    story = new_story()
    database = story.container.get(Database)
    with story.repeated_work.request():
        for _ in range(READ_LIMIT_REPEATS):
            database.rows(REPEATED_READ)
        database.update(Statement("UPDATE settings SET version = version WHERE 1 = 0"))
        for _ in range(READ_LIMIT_REPEATS):
            database.rows(REPEATED_READ)


def test_a_request_that_starts_one_command_past_the_limit_raises_and_names_the_command(new_story):
    with pytest.raises(RepeatedCallsError, match="true"):
        repeat_command(new_story(), COMMAND_LIMIT_REPEATS + 1)


def test_a_new_request_starts_every_count_at_zero(new_story):
    story = new_story()
    repeat_read(story, READ_LIMIT_REPEATS)
    repeat_read(story, READ_LIMIT_REPEATS)
