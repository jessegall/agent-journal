from tests.stories.core.support.fixtures import PlanFirstTaskClosed


def test_finishing_a_task_starts_the_next_open_task_by_phase_and_place_not_by_id(new_story):
    story = new_story(fixture=PlanFirstTaskClosed)
    story.expect_success("task show 3", "state: started", f"holder_id: {story.agent.id}")
    story.expect_success("task show 1", "state: open")


def test_finishing_the_last_task_of_a_phase_starts_the_first_task_of_the_next_phase(new_story):
    story = new_story(fixture=PlanFirstTaskClosed)
    story.run('task close 3 --outcome "done"', actor=story.agent)
    story.expect_success("task show 1", "state: started", f"holder_id: {story.agent.id}")


def test_cancelling_a_plan_cancels_its_open_tasks_in_every_phase_and_leaves_the_completed_ones(new_story):
    story = new_story(fixture=PlanFirstTaskClosed)
    story.expect_success('plan cancel 1 --reason "replaced"', "state: cancelled")
    story.expect_success("task show 2", "state: completed")
    story.expect_success("task show 3", "state: cancelled", "reason: plan 1 was cancelled")
    story.expect_success("task show 1", "state: cancelled", "reason: plan 1 was cancelled")
