from tests.stories.core.support import story_lines as lines
from tests.stories.core.modules.tasks.task_dependencies import three_tasks
from tests.stories.core.support.fixtures import DependencyChain


def test_a_guard_switched_off_by_its_setting_lets_the_refused_command_through(new_story):
    story = three_tasks(new_story)
    story.expect_refusal("task tag 1 networking", "networking is a new tag", actor=story.agent)
    story.expect_success("setting make journal.core.settings.guard.tasks.known-tag-word false", "created: setting:1")
    story.expect_success("task tag 1 networking", actor=story.agent)


def test_a_safety_guard_stays_on_whatever_its_setting_says(new_story):
    story = new_story(fixture=DependencyChain)
    story.expect_success("setting make journal.core.settings.guard.tasks.no-dependency-loop false", "created: setting:1")
    story.expect_refusal(lines.THIRD_TASK_DEPENDENCY, "refused by tasks.no-dependency-loop")


def test_the_lifecycle_guard_stays_on_whatever_its_setting_says(new_story):
    story = three_tasks(new_story)
    story.run("setting make journal.core.settings.guard.core.lifecycle false")
    story.expect_refusal(lines.TASK_CLOSE, "refused by core.lifecycle: task 1 is open, so it cannot close")


def test_a_switch_written_for_one_environment_leaves_the_guard_on_since_switches_are_project_wide(new_story):
    story = new_story(fixture=DependencyChain)
    story.run("setting make journal.core.settings.guard.tasks.no-dependency-loop false --environment main")
    story.expect_refusal(lines.THIRD_TASK_DEPENDENCY, "refused by tasks.no-dependency-loop")
