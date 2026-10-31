from core.testing.hook_samples import HookSamples
from tests.stories.core.base.drivers.support.fixtures import LeadLocked
from tests.stories.core.base.drivers.support.samples import SAMPLES


def test_two_moves_of_one_row_on_one_hook_run_the_first_and_drop_the_second_by_name(new_story):
    story = new_story(SAMPLES, fixture=LeadLocked)
    story.hook("s-1", HookSamples.prompt("go on"))
    story.expect_success("edit-lock show 1", "state: ended")
    story.expect_success("hook-call show 2", "dropped: samples.second-lock-release EditLockEnd")


def test_a_command_a_guard_refuses_rolls_back_alone_and_the_agent_is_told(new_story):
    story = new_story(SAMPLES, fixture=LeadLocked)
    story.run("edit-lock ended 1")
    story.expect_hook_through("s-1", HookSamples.prompt("go on"), "the journal could not run EditLockEnd")
    story.expect_success("hook-call list --agent 1", "3  prompt")
