import json

from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_making_a_resource_prints_only_what_was_created(new_story):
    story = new_story(fixture=BuilderStarted)
    assert story.run('task make "Fix the totals" --environment main', actor=story.agent).output_text.splitlines() == ["created: task:1"]


def test_changing_a_resource_prints_only_what_was_updated(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    assert story.run('task edit 1 --title "Fix the sums"', actor=story.agent).output_text.splitlines() == ["updated: task:1"]


def test_deleting_a_resource_prints_what_was_deleted(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    assert "deleted: task:1" in story.run("task delete 1", actor=story.agent).output_text.splitlines()


def test_json_keeps_the_whole_row(new_story):
    story = new_story(fixture=BuilderStarted)
    row = json.loads(story.run('task make "Fix the totals" --environment main --json', actor=story.agent).output_text)
    assert row["id"] == 1 and row["title"] == "Fix the totals"


def test_a_show_still_prints_the_whole_row(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    story.expect_text("task show 1", "title: Fix the totals", "state: open", actor=story.agent)


def test_a_refused_write_prints_its_refusal_and_no_confirmation(new_story):
    story = new_story(fixture=BuilderStarted)
    outcome = story.run('task make "" --environment main', actor=story.agent)
    assert outcome.code != 0 and "created:" not in outcome.output_text
