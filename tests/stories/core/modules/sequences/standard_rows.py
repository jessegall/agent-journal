from core.testing.story_fixture import StoryFixture

from dataclasses import replace

from core.base.database.database import Database
from core.base.query.queries import Queries
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.commands.save_standard_sequences.standard_sequences import STANDARD_SEQUENCES
from core.modules.templates.models.template import Template
from suites.coding.support.standard_templates import STANDARD_TEMPLATES
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
    assert {row.title for row in STANDARD_SEQUENCES} <= titles(story, Sequence)
    assert {row.title for row in STANDARD_TEMPLATES} <= titles(story, Template)


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
    assert plan_building(story).steps == next(row.steps for row in STANDARD_SEQUENCES if row.title == PLAN_BUILDING)
    assert len(titles(story, Sequence)) == count


def test_each_standard_sequence_has_one_guard_for_each_step():
    for sequence in STANDARD_SEQUENCES:
        assert sequence.step_guards.count("file_edits_allowed") == len(sequence.steps), sequence.title
    assert replace(STANDARD_SEQUENCES[0]).title == PLAN_BUILDING


class StartedSequences(StoryFixture):
    parent = BuilderWithUser

    def steps(self, story):
        started(story)
