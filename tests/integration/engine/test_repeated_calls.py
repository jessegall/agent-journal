import io
import subprocess

from engine.actor.actor import Actor
from engine.caller.caller import Caller
from engine.cli.console import Console
from engine.database.database import Database
from engine.database.errors.repeated_calls_error import RepeatedCallsError
from engine.database.repeated_work import READ_LIMIT_REPEATS
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
