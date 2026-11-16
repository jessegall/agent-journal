from tests.stories.support.story_checks import expect_value
from engine.testing.stories.story_fixture import StoryFixture

from dataclasses import replace

from engine.database.database import Database
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.commands.save_standard_sequences.standard_sequences import STANDARD_SEQUENCES
from server.work.booting_work import BootingWork
from tests.stories.core.support.coding_fixtures import UserBuilder

PLAN_BUILDING = "Building a plan"


def started(story):
    story.run_listeners()
    BootingWork().run(story.container)
    story.run_listeners()


def titles(story, model):
    return {row.title for row in story.story_rows(model)}


def plan_building(story):
    return next(row for row in story.story_rows(Sequence) if row.title == PLAN_BUILDING)


def test_an_old_copy_takes_the_newest_words_at_the_next_start_and_no_row_is_added(played):
    story = played(StartedSequences)
    stored = plan_building(story)
    count = len(titles(story, Sequence))
    database = story.container.get(Database)
    with database.transaction():
        database.connection.execute("UPDATE sequences SET steps = ? WHERE id = ?", ('["an old step"]', stored.id))
    started(story)
    expect_value(plan_building(story).steps, next((row.steps for row in STANDARD_SEQUENCES if row.title == PLAN_BUILDING)))
    expect_value(len(titles(story, Sequence)), count)


class StartedSequences(StoryFixture):
    parent = UserBuilder

    def steps(self, story):
        started(story)


def expect_title_replace(item, expected) -> None:
    actual = replace(item[0]).title
    assert actual == expected, actual


def expect_count_step_guards(sequence, text, expected) -> None:
    actual = sequence.step_guards.count(text)
    assert actual == expected, actual


def expect_titles(story, expected) -> None:
    actual = len(titles(story, Sequence))
    assert actual == expected, actual


def expect_steps_plan_building(story, expected) -> None:
    actual = plan_building(story).steps
    assert actual == expected, actual

