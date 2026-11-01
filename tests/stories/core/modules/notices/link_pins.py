from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.support.fixtures import UserJoined


def ran(line: str, output: str = ""):
    sample = HookSamples.shell(line, ShellPart(line.split()[0], CommandCategory.READ, line.split()[1:])).with_fields(event="post_tool_use")
    return sample.with_fields(raw={"tool_response": {"stdout": output}})


def test_a_link_in_a_commands_output_is_offered_as_a_pin(new_story):
    story = new_story(fixture=UserJoined)
    assert any("pin this link if the user will return to it" in line and "https://github.com/shop/cart/pull/4" in line for line in story.hook("s-1", ran("gh pr create", "https://github.com/shop/cart/pull/4\n")).lines)


def test_a_local_address_and_a_pinned_link_are_not_offered(new_story):
    story = new_story(fixture=UserJoined)
    story.run('notice make "The pull request" --link "https://github.com/shop/cart/pull/4" --environment main', actor=story.agent)
    story.expect_absent_hook_line("s-1", ran("cat log", "http://127.0.0.1:8000/x\n"), "pin this link")
    story.expect_absent_hook_line("s-1", ran("gh pr view", "https://github.com/shop/cart/pull/4/\n"), "pin this link")


def test_words_that_a_link_is_pinned_with_no_pin_made_are_pointed_out(new_story):
    story = new_story(fixture=UserJoined)
    assert any("you mentioned a pinned link but made none" in line for line in story.hook("s-1", ran('journal message send "I pinned it above"')).lines)
