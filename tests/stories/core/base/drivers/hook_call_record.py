from tests.stories.core.support import story_lines as lines
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.base.drivers.support.fixtures import LeadLocked, LeadStarted
from tests.stories.core.base.drivers.support.samples import SAMPLES

REMOVAL = HookSamples.shell("rm -rf build", ShellPart("rm", "edit", ["-rf", "build"], effects=["writes_files"]))


def test_an_exclusive_edit_lock_refuses_an_edit_and_its_hook_call_names_the_layer_and_each_outcome(new_story):
    story = new_story(SAMPLES, fixture=LeadLocked)
    story.expect_hook_refusal("s-1", HookSamples.edit("src/cart.py"), "edit_lock:1 refuses every edit")
    story.expect_text(lines.SECOND_HOOK_CALL, "layers: edit_lock:1", "samples.removal-limit: allowed", "samples.locked-edit-refusal: refused")


def test_under_an_exclusive_edit_lock_the_drivers_own_rules_are_passed_over_and_its_limit_still_asked(new_story):
    story = new_story(SAMPLES, fixture=LeadLocked)
    story.expect_hook_refusal("s-1", REMOVAL, "the lead removes no folder")
    story.hook("s-1", HookSamples.stop())
    story.expect_text("hook-call show 3", "samples.stop-line: silenced")


def test_a_hook_sent_twice_under_one_firing_gets_its_stored_answer_and_asks_no_rule(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    stop = HookSamples.stop().with_fields(firing="f-9")
    first = story.hook("s-1", stop)
    second = story.hook("s-1", stop)
    story.expect_rows(first == second)
    story.expect_text(f"hook-call list --agent {story.agent.id}", f"2  {story.agent.id}  stop")
    story.expect_absent(f"hook-call list --agent {story.agent.id}", f"3  {story.agent.id}  stop")
