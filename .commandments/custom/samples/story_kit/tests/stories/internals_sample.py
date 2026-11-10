# @sin testing_story_imports_journal_internals
from engine.database.database import Database

# @righteous testing_story_imports_journal_internals
from core.testing.story_fixture import StoryFixture

# @righteous testing_story_imports_journal_internals
from tests.stories.core.support.fixtures import UserJoined

# @righteous testing_story_imports_journal_internals
import json


def test_a_story_reads_the_container(new_story):
    story = new_story(fixture=UserJoined)
    # @sin testing_story_reads_journal_internals
    story.container.get(Database)


def test_a_story_reads_the_database(new_story):
    story = new_story(fixture=UserJoined)
    # @sin testing_story_reads_journal_internals
    story.home.database


def test_a_story_runs_a_command(new_story):
    story = new_story(fixture=UserJoined)
    # @righteous testing_story_reads_journal_internals
    story.expect_text("task list", "no tasks")


# @sin testing_story_takes_monkeypatch
def test_a_story_patches_the_journal(new_story, monkeypatch):
    new_story(fixture=UserJoined)


# @righteous testing_story_takes_monkeypatch
def test_a_story_patches_nothing(new_story, tmp_path):
    new_story(fixture=UserJoined)


def test_a_story_writes_sql(new_story):
    # @sin testing_story_builds_a_statement
    Statement("SELECT 1")


def test_a_story_reads_rows(new_story):
    story = new_story(fixture=UserJoined)
    # @righteous testing_story_builds_a_statement
    story.expect_rows(True)
