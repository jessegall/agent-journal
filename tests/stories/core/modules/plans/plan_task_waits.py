from tests.stories.core.support.fixtures import PlanTaskWaiting, PlanTasksWaitingOutside


def test_the_next_task_starter_skips_a_task_that_waits_and_starts_the_next_free_one(new_story):
    story = new_story(fixture=PlanTaskWaiting)
    story.run("task start 2", actor=story.agent)
    story.run('task close 2 --outcome "done"', actor=story.agent)
    story.expect_success("task show 1", "state: started", f"holder_id: {story.agent.id}")
    story.expect_success("task show 3", "state: open")


def test_the_next_task_starter_starts_nothing_when_every_open_task_waits(new_story):
    story = new_story(fixture=PlanTasksWaitingOutside)
    story.run("task start 2", actor=story.agent)
    story.run('task close 2 --outcome "done"', actor=story.agent)
    story.expect_success("task show 1", "state: open")
    story.expect_success("task show 3", "state: open")
