from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import StartedTaskBuilder
from core.modules.tasks.nudges.task_return_nudge import TaskReturnNudge
from engine.testing.expectations.expected_nudge import expected_nudge
from suites.coding.support.coding_settings import AUTO_MODE_SETTING
from core.modules.tasks.nudges.current_task_nudge import CurrentTaskNudge


def test_a_builder_whose_session_starts_again_is_told_its_task_and_its_last_log(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    story.run("task log 1 'the totals are worked out'", actor=story.agent)
    story.expect_hook_allowed("s-1", HookSamples.session_start(), CurrentTaskNudge.declared().nudge(task=1).text)


def test_a_builder_whose_wait_ends_is_told_it_is_back_at_its_task(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    story.run(f"setting set {AUTO_MODE_SETTING} off --environment main")
    story.run('task make "The review" --environment main')
    story.run("wait on 'the review of the cart' --target tasks:2", actor=story.agent)
    story.hook("s-1", HookSamples.stop())
    story.run("wait end 1", actor=story.agent)
    story.expect_hook_allowed("s-1", HookSamples.prompt("go on"), expected_nudge(TaskReturnNudge.declared(), task=1))
