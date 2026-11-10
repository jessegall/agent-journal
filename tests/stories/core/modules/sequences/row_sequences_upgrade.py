from tests.stories.engine.upgrade.support.fixture_upgrade import upgraded_story
from tests.stories.core.modules.sequences.support.upgraded_row_sequences import UpgradedRowSequences, expect_active_sequence, expect_dead_trigger_reported
from tests.stories.fixtures.row_sequences import prepare_row_sequences


def test_an_upgraded_plan_sequence_starts_when_a_plan_is_created(new_story):
    story = new_story(fixture=UpgradedRowSequences, environment="main")
    story.expect_success('plan make "Build the cart" --brief "The total is correct"', actor=story.agent)
    story.run_listeners()
    expect_active_sequence(story, "Building a plan")


def test_an_upgraded_document_sequence_starts_when_a_document_is_created(new_story):
    story = new_story(fixture=UpgradedRowSequences, environment="main")
    story.expect_success('doc make "Cart design" --abstract "The total" --body "Keep totals in cents"', actor=story.agent)
    story.run_listeners()
    expect_active_sequence(story, "Filing a document that is already written")


def test_an_upgraded_plan_review_sequence_starts_when_reviewers_are_assigned(new_story):
    story = new_story(fixture=UpgradedRowSequences, environment="main")
    story.expect_success("setting make journal.core.reviews.reviewer true")
    story.expect_success("setting make journal.core.reviews.reviewers-most 1")
    story.expect_success("review request plan 1 --points 2", actor=story.agent)
    story.run_listeners()
    expect_active_sequence(story, "Applying a plan's reviews")


def test_an_upgraded_custom_sequence_keeps_its_steps_and_reports_its_dead_trigger(new_story):
    story = upgraded_story(new_story, prepare=prepare_row_sequences)
    expect_dead_trigger_reported(story)
