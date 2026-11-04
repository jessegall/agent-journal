import json

from tests.stories.core.support.coding_fixtures import BuilderStarted
from core.testing.expect_row import expect_row
from tests.stories.support.story_checks import expect_changed_code_outcome


def test_making_a_resource_prints_only_what_was_created(new_story):
    story = new_story(fixture=BuilderStarted)
    expect_output_3(story, 'task make "Fix the totals" --environment main', ["created: task:1"])


def test_changing_a_resource_prints_only_what_was_updated(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    expect_output_3(story, 'task edit 1 --title "Fix the sums"', ["updated: task:1"])


def test_deleting_a_resource_prints_what_was_deleted(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    expect_output_with(story, "task delete 1", "deleted: task:1")


def test_json_keeps_the_whole_row(new_story):
    story = new_story(fixture=BuilderStarted)
    row = json.loads(story.run('task make "Fix the totals" --environment main --json', actor=story.agent).output_text)
    expect_row(row, id=1)
    expect_row(row, title="Fix the totals")


def test_a_show_still_prints_the_whole_row(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    story.expect_text("task show 1", "title: Fix the totals", "state: open", actor=story.agent)


def test_a_refused_write_prints_its_refusal_and_no_confirmation(new_story):
    story = new_story(fixture=BuilderStarted)
    outcome = story.run('task make "" --environment main', actor=story.agent)
    expect_changed_code_outcome(outcome, 0)
    expect_output_outcome_without(outcome, "created:")


def test_a_row_another_command_of_the_same_actor_wrote_meanwhile_is_not_named(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    story.run('task make "Fix the sums" --environment main', actor=story.agent)
    expect_output_3(story, "task start 2", ["updated: task:2"])


def expect_output_3(story, text, expected) -> None:
    actual = story.run(text, actor=story.agent).output_text.splitlines()
    assert actual == expected, actual


def expect_output_outcome_without(outcome, expected) -> None:
    actual = outcome.output_text
    assert expected not in actual, actual


def expect_output_with(story, text, expected) -> None:
    actual = story.run(text, actor=story.agent).output_text.splitlines()
    assert expected in actual, actual
