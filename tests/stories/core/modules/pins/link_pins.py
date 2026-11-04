from core.base.driver.command_category import CommandCategory
from core.base.driver.tool_type import ToolType
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.support.fixtures import UserJoined


def shell_call(line: str, output: str = ""):
    sample = HookSamples.shell(line, ShellPart(line.split()[0], CommandCategory.READ, line.split()[1:])).with_fields(event="post_tool_use")
    return sample.with_raw({"tool_response": {"stdout": output}})


def test_a_link_in_a_commands_output_is_offered_as_a_pin(new_story):
    story = new_story(fixture=UserJoined)
    assert any("pin this link if the user will return to it" in line and "https://docs.example.com/pages/4" in line for line in story.hook("s-1", shell_call("gh pr create", "https://docs.example.com/pages/4\n")).lines)


def test_a_local_address_and_a_pinned_link_are_not_offered(new_story):
    story = new_story(fixture=UserJoined)
    story.run('pin make "The pull request" --link "https://docs.example.com/pages/4" --environment main', actor=story.agent)
    story.expect_absent_hook_line("s-1", shell_call("cat log", "http://127.0.0.1:8000/x\n"), "pin this link")
    story.expect_absent_hook_line("s-1", shell_call("curl", "http://journal/health\n"), "pin this link")
    story.expect_absent_hook_line("s-1", shell_call("gh pr view", "https://docs.example.com/pages/4/\n"), "pin this link")


def pin_lines(hook_answer) -> list[str]:
    return [line for line in hook_answer.lines if "pin this link" in line]


def test_each_link_is_offered_on_its_own_and_only_once(new_story):
    story = new_story(fixture=UserJoined)
    expect_pin_lines(story.hook("s-1", shell_call("gh pr create", "https://docs.example.com/pages/4\n")))
    expect_pin_lines(story.hook("s-1", shell_call("gh pr create", "https://docs.example.com/pages/5\n")))
    expect_absent_pin_lines(story.hook("s-1", shell_call("gh pr view", "https://docs.example.com/pages/4\n")))


def test_a_link_of_a_closed_pin_is_offered_again(new_story):
    story = new_story(fixture=UserJoined)
    story.run('pin make "The pull request" --link "https://docs.example.com/pages/4" --environment main', actor=story.agent)
    story.expect_success("pin close 1", actor=story.user)
    expect_pin_lines(story.hook("s-1", shell_call("gh pr view", "https://docs.example.com/pages/4\n")))


def test_a_pull_request_pins_itself_once_and_a_closed_pin_stays_closed(new_story):
    story = new_story(fixture=UserJoined)
    address = "https://github.com/shop/cart/pull/4"
    expect_absent_pin_lines(story.hook("s-1", shell_call("gh pr create", f"{address}\n")))
    story.expect_text("pin list --environment main", "Pull request 4", address, actor=story.user)
    story.hook("s-1", shell_call("gh pr view", f"{address}\n"))
    story.expect_success("pin close 1", actor=story.user)
    story.hook("s-1", shell_call("gh pr view", f"{address}\n"))
    story.expect_absent("pin list --environment main", "Pull request 4", actor=story.user)


def test_a_link_a_subagent_returned_is_offered(new_story):
    story = new_story(fixture=UserJoined)
    response = {"content": [{"type": "text", "text": "Link: https://claude.ai/design/p/1"}]}
    sample = HookSamples.tool_use("Agent", ToolType.UNCATEGORISED, [], None).with_fields(event="post_tool_use").with_raw({"tool_response": response})
    expect_pin_lines(story.hook("s-1", sample))


def test_a_link_in_a_message_the_agent_sends_is_offered(new_story):
    story = new_story(fixture=UserJoined)
    expect_pin_lines(story.hook("s-1", shell_call('journal message send "see https://claude.ai/design/p/1"')))


def test_a_link_in_a_file_the_agent_reads_is_not_offered(new_story):
    story = new_story(fixture=UserJoined)
    sample = HookSamples.tool_use("Read", ToolType.READ, ["a.md"], None).with_fields(event="post_tool_use").with_raw({"tool_response": {"content": "https://claude.ai/design/p/1"}})
    expect_absent_pin_lines(story.hook("s-1", sample))


def test_a_link_in_the_agents_text_is_offered(new_story):
    story = new_story(fixture=UserJoined)
    expect_pin_lines(story.hook("s-1", HookSamples.message_display("Here: https://claude.ai/design/p/1")))


def test_words_that_a_link_is_pinned_with_no_pin_made_are_pointed_out(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_hook_allowed("s-1", shell_call('journal message send "I pinned it above"'), "you mentioned a pinned link but made none")


def expect_pin_lines(hook_answer) -> None:
    assert pin_lines(hook_answer)


def expect_absent_pin_lines(hook_answer) -> None:
    assert not pin_lines(hook_answer)
