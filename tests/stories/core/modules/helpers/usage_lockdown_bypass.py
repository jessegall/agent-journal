from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.integration.core.modules.helpers.test_usage_limits import report
from tests.stories.core.modules.helpers.usage_lockdown import EDIT, STOP_LINE, lockdown_story

EMERGENCY_STOP_FILE_PATH = "/".join([".journal", "panic"])
EMERGENCY_STOP_FILE_EDIT = HookSamples.shell(f"touch {EMERGENCY_STOP_FILE_PATH}", ShellPart("touch", CommandCategory.EDIT, [EMERGENCY_STOP_FILE_PATH]))
PROMPT = HookSamples.prompt("Go on")


def test_a_main_agents_prompt_and_its_write_of_the_emergency_stop_file_pass_the_lockdown_while_its_other_tools_stay_stopped(new_story):
    story = lockdown_story(new_story)
    story.expect_rows(story.hook("s-1", EMERGENCY_STOP_FILE_EDIT).refusal != "")
    report(story, 55)
    prompt, emergency_stop_file_reply, edit = story.hook("s-1", PROMPT), story.hook("s-1", EMERGENCY_STOP_FILE_EDIT), story.hook("s-1", EDIT)
    story.expect_rows(prompt.halt == "", emergency_stop_file_reply.halt == "", emergency_stop_file_reply.refusal == "", edit.halt.startswith(STOP_LINE), detail=f"{prompt.halt} | {emergency_stop_file_reply.halt} | {emergency_stop_file_reply.refusal}")


def test_a_helpers_prompt_and_its_write_of_the_emergency_stop_file_are_stopped_at_the_lockdown(new_story):
    story = lockdown_story(new_story)
    story.expect_success(f"agent start helper-session claude helper --parent {story.agent.id} --environment main")
    report(story, 55)
    story.expect_rows(story.hook("helper-session", PROMPT).halt.startswith(STOP_LINE), story.hook("helper-session", EMERGENCY_STOP_FILE_EDIT).halt.startswith(STOP_LINE))
