from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.fixtures import ThreeTasks
from tests.stories.core.modules.tasks.task_lifecycle import started_story


def three_tasks(new_story):
    return new_story(fixture=ThreeTasks)


def test_a_task_waits_on_another_and_stops_waiting(new_story):
    story = three_tasks(new_story)
    story.expect_success(lines.FIRST_TASK_DEPENDENCY, "task_id: 1", "dependency_id: 2")
    story.expect_success("task remove-dependency 1 --on 2", "the dependency is removed")
    story.expect_refusal("task remove-dependency 1 --on 2", "task 1 does not wait on task 2")


def test_a_task_cannot_wait_on_itself(new_story):
    story = three_tasks(new_story)
    story.expect_refusal("task depend 1 --on 1", "a task-dependency must keep to task_id != dependency_id")


def test_a_loop_of_three_is_refused_by_its_guard_with_the_flag_that_passes_it(new_story):
    story = three_tasks(new_story)
    story.run(lines.FIRST_TASK_DEPENDENCY)
    story.run("task depend 2 --on 3")
    story.expect_refusal(lines.THIRD_TASK_DEPENDENCY, "refused by tasks.no-dependency-loop: task 1 already waits on task 3, so this would be a loop")
    story.expect_refusal(lines.THIRD_TASK_DEPENDENCY, "(to pass it: --skip-guard tasks.no-dependency-loop)")


def test_the_same_dependency_twice_is_refused(new_story):
    story = three_tasks(new_story)
    story.run(lines.FIRST_TASK_DEPENDENCY)
    story.expect_refusal(lines.FIRST_TASK_DEPENDENCY, "a task-dependency with that task_id, dependency_id exists already")


def test_deleting_a_task_removes_its_dependencies_first(new_story):
    story = three_tasks(new_story)
    story.run(lines.FIRST_TASK_DEPENDENCY)
    story.run(lines.THIRD_TASK_DEPENDENCY)
    story.expect_success(lines.TASK_DELETION, "the task is deleted")
    story.expect_success("task-dependency list", "nothing found")
