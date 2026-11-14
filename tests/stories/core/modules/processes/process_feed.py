from engine.actor.actor import Actor
from engine.enums.command_category import CommandCategory
from tests.stories.core.modules.processes.support.cadence_probe import side_run
from tests.stories.core.modules.processes.support.process_samples import start_process
from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_the_feed_brings_a_process_with_only_its_line_and_state(new_story):
    story = new_story(fixture=BuilderStarted)
    start_process(story)
    side_run(story, Actor.core(), "hook --judge-event=event-1.json", CommandCategory.CHECK, plugin="sample")
    answer = story.run("process feed --json", actor=story.user)
    answer.expect_no_text("judge-event")
    story.expect_text("process list --columns id,line --environment main", "judge-event", actor=story.user)
    answer.expect_text('"line"')
    answer.expect_text('"state": "running"')
    answer.expect_no_text('"folder"')
    answer.expect_no_text('"shell"')
    answer.expect_no_text('"pid"')


def test_the_feed_brings_one_process_by_its_number(new_story):
    story = new_story(fixture=BuilderStarted)
    start_process(story)
    story.expect_text("process feed --id 1 --json", '"id": 1', actor=story.user)
    story.expect_text("process feed --id 9 --json", '"rows": []', actor=story.user)
