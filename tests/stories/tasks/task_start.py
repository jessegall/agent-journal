from tests.stories.tasks.task_lifecycle import started_story


def test_a_start_holds_the_task_for_the_caller_and_logs_the_change(new_story):
    story = started_story(new_story)
    story.run('task make "Fix the cart" --environment main')
    story.expect_success("task start 1", "state: started", f"holder_id: {story.agent.id}", actor=story.agent)
    story.expect_success("event show 5", "event: task.start", "row_id: 1", f"actor_id: {story.agent.id}", "command: TaskStart")


def test_a_completed_task_cannot_start_and_the_refusal_names_the_way_on(new_story):
    story = started_story(new_story)
    story.run('task make "Fix the cart" --environment main')
    story.run("task start 1", actor=story.agent)
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.expect_refusal("task start 1", "refused by core.lifecycle: task 1 is completed, so it cannot start: from completed it can only go on with journal task reopen 1")
