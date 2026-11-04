from core.testing.story_fixture import StoryFixture

from dataclasses import replace

from core.base.database.database import Database
from core.base.query.queries import Queries
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.commands.save_standard_sequences.standard_sequences import STANDARD_SEQUENCES
from core.modules.templates.models.template import Template
from suites.coding.support.coding_templates import CODING_TEMPLATES
from suites.coding.modules.workers.support.worker_templates import WORKER_TEMPLATES
from server.booting_work import BootingWork
from tests.stories.core.support.coding_fixtures import BuilderWithUser

PLAN_BUILDING = "Building a plan"


def started(story):
    story.run_listeners()
    BootingWork().run(story.container)
    story.run_listeners()


def titles(story, model):
    return {row.title for row in story.container.get(Queries).query(model).all_rows()}


def plan_building(story):
    return next(row for row in story.container.get(Queries).query(Sequence).all_rows() if row.title == PLAN_BUILDING)


def test_a_fresh_journal_lists_what_comes_with_it_after_a_start(new_story):
    story = new_story(fixture=StartedSequences)
    expect_title_standard_templates_limit(STANDARD_SEQUENCES, titles(story, Sequence))
    expect_title_standard_templates_limit([*CODING_TEMPLATES, *WORKER_TEMPLATES], titles(story, Template))


def test_a_person_cannot_change_a_sequence_that_comes_with_the_journal(new_story):
    story = new_story(fixture=StartedSequences)
    story.expect_refusal(f"sequence delete {plan_building(story).id}", "comes with the journal", actor=story.user)


def test_an_old_copy_takes_the_newest_words_at_the_next_start_and_no_row_is_added(new_story):
    story = new_story(fixture=StartedSequences)
    stored = plan_building(story)
    count = len(titles(story, Sequence))
    database = story.container.get(Database)
    with database.transaction():
        database.connection.execute("UPDATE sequences SET steps = ? WHERE id = ?", ('["an old step"]', stored.id))
    started(story)
    expect_steps_plan_building(story, next(row.steps for row in STANDARD_SEQUENCES if row.title == PLAN_BUILDING))
    expect_titles(story, count)


def test_each_standard_sequence_has_one_guard_for_each_step():
    for sequence in STANDARD_SEQUENCES:
        expect_count_step_guards(sequence, "file_edits_allowed", len(sequence.steps))
    expect_title_replace(STANDARD_SEQUENCES, PLAN_BUILDING)


class StartedSequences(StoryFixture):
    parent = BuilderWithUser

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
