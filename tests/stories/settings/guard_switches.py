from tests.stories.tasks.task_dependencies import three_tasks


def test_a_guard_switched_off_by_its_setting_lets_the_refused_command_through(story_on):
    story = three_tasks(story_on)
    story.run("task depend 1 --on 2")
    story.run("task depend 2 --on 3")
    story.run("setting make tasks.no-dependency-loop false")
    story.expect_success("task depend 3 --on 1", "task_id: 3", "dependency_id: 1")


def test_the_lifecycle_guard_stays_on_whatever_its_setting_says(story_on):
    story = three_tasks(story_on)
    story.run("setting make core.lifecycle false")
    story.expect_refusal('task close 1 --outcome "done"', "refused by core.lifecycle: task 1 is open, so it cannot close")
