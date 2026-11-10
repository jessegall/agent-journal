from tests.stories.core.modules.plans.support.started_plans import OldestPlanWaitsOutside
from tests.stories.suites.coding.support.hand_outs import next_task_id


def test_c7_a_cancelled_task_no_longer_keeps_the_plan_tasks_that_waited_on_it_back(new_story):
    story = new_story(fixture=OldestPlanWaitsOutside)
    story.run('task cancel 7 --reason "the supplier is dropped" --environment main', actor=story.user)
    story.run_listeners()
    story.expect_rows(next_task_id(story) == 1)


def test_c8_a_task_the_agent_has_started_is_not_handed_out_again_and_the_tasks_that_wait_on_it_stay_back(new_story):
    story = new_story(fixture=OldestPlanWaitsOutside)
    story.expect_success("task start 7", actor=story.agent)
    story.expect_rows(next_task_id(story) == 3)
