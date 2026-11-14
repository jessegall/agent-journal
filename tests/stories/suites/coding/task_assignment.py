from tests.stories.engine.driver.support.fixtures import LeadStarted
from tests.stories.engine.driver.support.samples import SAMPLES
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.suites.coding.support.task_assigner_samples import PATH


def two_tasks_first_started(story) -> None:
    story.run('task make "First" --environment main', actor=story.agent)
    story.run('task make "Second" --environment main', actor=story.agent)
    story.run("task start 1", actor=story.agent)
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.run_listeners()


def test_the_coding_suite_hands_out_the_next_task(new_story):
    story = new_story(fixture=BuilderStarted)
    two_tasks_first_started(story)
    story.expect_success("task show 2", "state: started", actor=story.agent)


def test_a_suite_without_a_way_of_handing_out_tasks_hands_out_nothing(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    two_tasks_first_started(story)
    story.expect_success("task show 2", "state: open", actor=story.agent)


def test_a_suite_with_its_own_way_hands_out_tasks_its_own_way(new_story):
    story = new_story(SAMPLES, f"{PATH}:OwnAssignerModule", fixture=LeadStarted)
    two_tasks_first_started(story)
    story.expect_success("task show 2", "state: started", actor=story.agent)
