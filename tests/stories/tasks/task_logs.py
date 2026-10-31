from tests.stories.tasks.task_lifecycle import started_story


def test_lines_written_on_a_task_are_listed_in_the_order_written(new_story):
    story = started_story(new_story)
    story.run('task make "Fix the cart" --environment main')
    story.expect_success('task log 1 "found the rounding error"', "line: found the rounding error", f"creator_id: {story.agent.id}", actor=story.agent)
    story.run('task log 1 "fixed and tested"', actor=story.agent)
    story.expect_success("task-log list --task 1 --oldest", "1  1  found the rounding error", "2  1  fixed and tested")


def test_a_tasks_lines_go_with_it(new_story):
    story = started_story(new_story)
    story.run('task make "Fix the cart" --environment main')
    story.run('task log 1 "found the rounding error"')
    story.expect_success("task delete 1", "the task is deleted")
    story.expect_success("task-log list --task 1", "nothing found")
