from engine.testing.stories.story_fixture import StoryFixture

from dataclasses import replace

from engine.database.database import Database
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.commands.save_standard_sequences.standard_sequences import STANDARD_SEQUENCES
from core.modules.templates.models.template import Template
from suites.coding.templates.coding_templates import CODING_TEMPLATES
from suites.coding.modules.workers.support.worker_templates import WORKER_TEMPLATES
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


def test_a_fresh_journal_lists_what_comes_with_it_after_a_start(new_story):
    story = new_story(fixture=StartedSequences)
    expect_title_standard_templates_limit(STANDARD_SEQUENCES, titles(story, Sequence))
    expect_title_standard_templates_limit([*CODING_TEMPLATES, *WORKER_TEMPLATES], titles(story, Template))


def test_a_person_cannot_change_a_sequence_that_comes_with_the_journal(new_story):
    story = new_story(fixture=StartedSequences)
    story.expect_refusal(f"sequence delete {plan_building(story).id}", "comes with the journal", actor=story.user)




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
