import sqlite3

import pytest

from core.base.database.database import Database
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.pins.models.pin import Pin
from core.testing.story_fixture import StoryFixture
from tests.stories.core.base.command.support.lock_commands import ReadUnlockedPinsHandler
from tests.stories.core.support.fixtures import UserJoined


class LockCommands(StoryFixture):
    parent = UserJoined

    def steps(self, story) -> None:
        story.expect_sync_success("tests.stories.core.base.command.support.lock_commands:LockCommandsModule")
        story.expect_success('pin make "Existing pin" --link https://example.com --environment main', actor=story.user)


def test_an_unlocked_command_allows_another_connection_to_write_while_it_reads(new_story, monkeypatch):
    story = new_story(fixture=LockCommands)
    original = ReadUnlockedPinsHandler.handle
    observed = []

    def count_pins_during_write(handler, command, context):
        writer = sqlite3.connect(story.home.database, timeout=0, autocommit=True)
        try:
            writer.execute("BEGIN IMMEDIATE")
            writer.execute("UPDATE pins SET title = 'Concurrent pin' WHERE title = 'Existing pin'")
            observed.append(original(handler, command, context))
            writer.execute("COMMIT")
            return observed[-1]
        finally:
            writer.close()

    monkeypatch.setattr(ReadUnlockedPinsHandler, "handle", count_pins_during_write)
    story.expect_success("lock-sample read --environment main", "1", actor=story.user)
    story.expect_rows(observed == [1])
    story.expect_rows(story.container.get(Queries).query(Pin).first().title == "Concurrent pin")
    story.expect_rows(story.container.get(Database).nested == [])


@pytest.mark.parametrize(("line", "remaining"), [
    ("write", ["Existing pin"]),
    ("write-unlocked", ["Existing pin", "First pin"]),
    ("write-nested", ["Existing pin"]),
    ("write-unlocked-nested", ["Existing pin"]),
])
def test_a_locked_command_rolls_back_its_own_writes_also_inside_an_unlocked_one(new_story, monkeypatch, line, remaining):
    story = new_story(fixture=LockCommands)
    original = Repository.save

    def second_pin_fail(repository, model, context):
        if isinstance(model, Pin) and model.title == "Second pin":
            raise Refusal("the second pin cannot be written")
        return original(repository, model, context)

    monkeypatch.setattr(Repository, "save", second_pin_fail)
    story.expect_refusal(f"lock-sample {line} --environment main", "the second pin cannot be written", actor=story.user)
    story.expect_rows([pin.title for pin in story.container.get(Queries).query(Pin).oldest().all_rows()] == remaining)
    story.expect_rows(story.container.get(Database).nested == [])
    story.expect_rows(not story.container.get(Database).has_transaction)
