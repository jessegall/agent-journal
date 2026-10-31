from datetime import timedelta

from core.testing.hook_samples import HookSamples
from tests.stories.core.base.drivers.support.fixtures import LeadStarted, LeadWaiting
from tests.stories.core.base.drivers.support.samples import SAMPLES
from tests.stories.core.support import story_lines as lines


def test_a_wait_on_a_task_takes_control_and_the_drivers_ordinary_rules_go_quiet(new_story):
    story = new_story(SAMPLES, fixture=LeadWaiting)
    story.hook("s-1", HookSamples.stop())
    story.expect_text(lines.SECOND_HOOK_CALL, "layers: wait:1", "samples.stop-line: silenced")


def test_a_wait_ends_when_its_task_closes_and_the_history_rule_speaks_once_after_it(new_story):
    story = new_story(SAMPLES, fixture=LeadWaiting)
    story.hook("s-1", HookSamples.stop())
    story.expect_success("task start 1", "state: started", actor=story.agent)
    story.expect_success(lines.TASK_CLOSE, "state: completed", actor=story.agent)
    story.expect_text("wait show 1", "state: ended")
    story.expect_hook_allowed("s-1", HookSamples.prompt("go on"), "you are back at your own work")
    story.expect_absent_hook_line("s-1", HookSamples.prompt("and on"), "you are back at your own work")


def test_a_stuck_agent_is_told_nothing_and_its_stop_goes_through(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.run("wait stuck 'the build server is down'", actor=story.agent)
    story.expect_hook_silent("s-1", HookSamples.stop())


def test_a_newer_wait_is_the_newer_layer_and_a_resumed_one_is_newest_again(new_story):
    story = new_story(SAMPLES, fixture=LeadWaiting)
    story.run('task make "The deploy" --environment main')
    story.run("wait on 'the deploy' --target tasks:2", actor=story.agent)
    story.hook("s-1", HookSamples.stop())
    story.expect_text(lines.SECOND_HOOK_CALL, "layers: wait:2, wait:1")
    story.run("wait end 1", actor=story.agent)
    story.advance(timedelta(minutes=1))
    story.run("wait resume 1", actor=story.agent)
    story.hook("s-1", HookSamples.stop())
    story.expect_text("hook-call show 3", "layers: wait:1, wait:2")
