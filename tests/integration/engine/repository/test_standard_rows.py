from tests.stories.support.story_checks import expect_value
from dataclasses import replace

from core.modules.sequences.commands.save_standard_sequences.standard_sequences import STANDARD_SEQUENCES
from core.modules.sequences.models.sequence import Sequence
from engine.testing.stories.story_fixture import StoryFixture
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


def expect_title_standard_templates_limit(item, expected) -> None:
    actual = {row.title for row in item}
    assert actual <= expected, actual


def test_each_standard_sequence_has_one_guard_for_each_step():
    for sequence in STANDARD_SEQUENCES:
        expect_value(sequence.step_guards.count('file_edits_allowed'), len(sequence.steps))
    expect_value(replace(STANDARD_SEQUENCES[0]).title, PLAN_BUILDING)
