import json
from unittest.mock import patch

from core.base.database.database import Database
from core.base.driver.command_category import CommandCategory
from core.base.driver.tool_type import ToolType
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent
from tests.stories.core.modules.helpers.helper_reports import reported


def shell_call(line: str, output: str = ""):
    program = line.split()[0]
    category = CommandCategory.READ if program == "cat" else CommandCategory.PROCESS
    sample = HookSamples.shell(line, ShellPart(program, category, line.split()[1:])).with_fields(event="post_tool_use")
    return sample.with_raw({"tool_response": {"stdout": output}})


def test_a_link_in_a_commands_output_is_offered_as_a_pin(new_story):
    story = new_story(fixture=UserJoined)
    expect_lines_hook_2("pin this link if the user will return to it", "https://docs.example.com/pages/4", story, "s-1", "gh pr create", "https://docs.example.com/pages/4\n")


def test_a_local_address_and_a_pinned_link_are_not_offered(new_story):
    story = new_story(fixture=UserJoined)
    story.run('pin make "The pull request" --link "https://docs.example.com/pages/4" --environment main', actor=story.agent)
    story.expect_absent_hook_line("s-1", shell_call("cat log", "http://127.0.0.1:8000/x\n"), "pin this link")
    story.expect_absent_hook_line("s-1", shell_call("curl", "http://journal/health\n"), "pin this link")
    story.expect_absent_hook_line("s-1", shell_call("gh pr view", "https://docs.example.com/pages/4/\n"), "pin this link")


def pin_lines(hook_answer) -> list[str]:
    return [line for line in hook_answer.lines if "pin this link" in line]


def test_a_pull_request_pins_itself_once_and_a_closed_pin_stays_closed(new_story):
    story = new_story(fixture=UserJoined)
    address = "https://github.com/shop/cart/pull/4"
    expect_absent_pin_lines(story.hook("s-1", shell_call("gh pr create", f"{address}\n")))
    story.expect_text("pin list --environment main", "Pull request 4", address, actor=story.user)
    story.hook("s-1", shell_call("gh pr view", f"{address}\n"))
    story.expect_success("pin close 1", actor=story.user)
    story.hook("s-1", shell_call("gh pr view", f"{address}\n"))
    story.expect_absent("pin list --environment main", "Pull request 4", actor=story.user)


def test_a_bare_design_project_link_is_not_pinned(new_story):
    story = new_story(fixture=UserJoined)
    response = {"content": [{"type": "text", "text": "Projects: https://claude.ai/design/p/1 https://claude.ai/design/p/2"}]}
    sample = HookSamples.tool_use("Agent", ToolType.UNCATEGORISED, [], None).with_fields(event="post_tool_use").with_raw({"tool_response": response})
    story.hook("s-1", sample)
    story.expect_absent("pin list --environment main", "https://claude.ai/design/p/1", actor=story.user)


def test_a_helper_report_pins_a_design_only_once_even_after_it_is_closed(new_story):
    address = "https://claude.ai/design/cart/checkout-screen"
    story = reported(new_story, StartedHelper, f"Design: {address}")
    story.expect_text("pin list --environment main", "Design: checkout screen", address, actor=story.user)
    story.expect_success("pin close 1", actor=story.user)
    story.hook("s-1", HookSamples.message_display(f"Design: {address}/"))
    story.expect_absent("pin list --environment main", address, actor=story.user)


def test_a_helper_tool_output_pins_a_pull_request(new_story):
    story = new_story(fixture=StartedHelper)
    address = "https://github.com/shop/cart/pull/23"
    story.hook(helper_agent(story).session, shell_call("gh pr create", address))
    story.expect_text("pin list --environment main", "Pull request 23", address, actor=story.user)


def test_the_main_agents_text_does_not_pin_a_design(new_story):
    story = new_story(fixture=UserJoined)
    address = "https://claude.ai/design/cart/payment-page"
    story.hook("s-1", HookSamples.message_display(f"The design: {address}"))
    story.expect_absent("pin list --environment main", address, actor=story.user)


def test_a_link_in_a_file_the_agent_reads_is_not_offered(new_story):
    story = new_story(fixture=UserJoined)
    sample = HookSamples.tool_use("Read", ToolType.READ, ["a.md"], None).with_fields(event="post_tool_use").with_raw({"tool_response": {"content": "https://claude.ai/design/p/1"}})
    expect_absent_pin_lines(story.hook("s-1", sample))


def test_shortened_links_are_neither_pinned_nor_suggested(new_story):
    story = new_story(fixture=UserJoined)
    text = "https://claude.ai/design/p/abc… https://github.com/shop/cart/pull/23... https://docs.example.com/a…b"
    expect_absent_pin_lines(story.hook("s-1", shell_call("curl example", text)))
    story.expect_absent("pin list --environment main", "claude.ai", actor=story.user)
    story.expect_absent("pin list --environment main", "github.com", actor=story.user)


def test_design_files_are_pinned_once_and_a_bare_project_does_not_duplicate_them(new_story):
    project = "https://claude.ai/design/p/cart"
    story = reported(new_story, StartedHelper, "\n".join((f"{project}?file=Checkout&mode=edit", f"{project}?mode=preview&file=Checkout", project, f"{project}?file=Payment")))
    pins = json.loads(story.run("pin list --environment main --json", actor=story.user).output_text)["rows"]
    story.expect_rows(len(pins) == 2, {pin["title"] for pin in pins} == {"Design: Checkout", "Design: Payment"})


def test_a_link_in_the_agents_text_is_offered(new_story):
    story = new_story(fixture=UserJoined)
    expect_pin_lines(story.hook("s-1", HookSamples.message_display("Here: https://docs.example.com/pages/1")))


def test_words_that_a_link_is_pinned_with_no_pin_made_are_pointed_out(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_hook_allowed("s-1", shell_call('journal message send "I pinned it above"'), "you mentioned a pinned link but made none")


def expect_pin_lines(hook_answer) -> None:
    assert pin_lines(hook_answer)


def expect_absent_pin_lines(hook_answer) -> None:
    assert not pin_lines(hook_answer)


def expect_lines_hook_2(text, text_2, story, text_3, text_4, text_5) -> None:
    actual = any((text in line and text_2 in line for line in story.hook(text_3, shell_call(text_4, text_5)).lines))
    assert actual, actual


def test_a_link_in_the_command_and_output_is_checked_once(new_story):
    story = new_story(fixture=UserJoined)
    link = "https://docs.example.com/pages/4"
    database = story.container.get(Database)
    with patch.object(database, "rows", wraps=database.rows) as reads:
        expect_pin_lines(story.hook("s-1", shell_call(f"curl {link}", link)))
    pin_reads = [call for call in reads.call_args_list if "FROM pins WHERE closed_at IS NULL AND link IN" in call.args[0].sql and "count(*)" not in call.args[0].sql]
    story.expect_rows(len(pin_reads) == 1)
