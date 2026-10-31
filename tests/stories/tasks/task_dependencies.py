from tests.stories.tasks.task_lifecycle import started_story


def three_tasks(story_on):
    story = started_story(story_on)
    for title in ("First", "Second", "Third"):
        story.run(f'task make "{title}" --environment main')
    return story


def test_a_task_waits_on_another_and_stops_waiting(story_on):
    story = three_tasks(story_on)
    story.expect_success("task depend 1 --on 2", "task_id: 1", "dependency_id: 2")
    story.expect_success("task undepend 1 --on 2", "the dependency is removed")
    story.expect_refusal("task undepend 1 --on 2", "task 1 does not wait on task 2")


def test_a_task_cannot_wait_on_itself(story_on):
    story = three_tasks(story_on)
    story.expect_refusal("task depend 1 --on 1", "a task-dependency must keep to task_id != dependency_id")


def test_a_loop_of_three_is_refused_by_its_guard_with_the_flag_that_passes_it(story_on):
    story = three_tasks(story_on)
    story.run("task depend 1 --on 2")
    story.run("task depend 2 --on 3")
    story.expect_refusal("task depend 3 --on 1", "refused by tasks.no-dependency-loop: task 1 already waits on task 3, so this would be a loop")
    story.expect_refusal("task depend 3 --on 1", "(to pass it knowingly: --skip-guard tasks.no-dependency-loop)")


def test_the_same_dependency_twice_is_refused(story_on):
    story = three_tasks(story_on)
    story.run("task depend 1 --on 2")
    story.expect_refusal("task depend 1 --on 2", "a task-dependency with that task_id, dependency_id exists already")


def test_deleting_a_task_removes_its_dependencies_first(story_on):
    story = three_tasks(story_on)
    story.run("task depend 1 --on 2")
    story.run("task depend 3 --on 1")
    story.expect_success("task delete 1", "the task is deleted")
    story.expect_success("task-dependency list", "nothing found")
