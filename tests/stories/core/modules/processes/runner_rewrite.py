from core.base.shell_sandbox import ShellSandbox
from core.modules.processes.support.stock_reader import STOCK_READERS
from core.modules.processes.support.output_folder import OutputFolder
from datetime import timedelta
import pytest

from core.base.command.bus import Bus
from core.modules.processes.commands.end_process_part.end_process_part import EndProcessPart
from core.modules.processes.commands.start_process_part.start_process_part import StartProcessPart
from core.base.driver.command_category import CommandCategory
from core.base.driver.command_effect import CommandEffect
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.base.driver.support.samples import SAMPLES
from tests.stories.core.modules.chat.support.mark_samples import mark_count, expect_mark_count
from tests.stories.core.modules.processes.support.process_samples import expect_rewritten, install_runner, runner_line, user_waits, with_parse_error
from tests.stories.core.support.coding_fixtures import BuilderStarted, HelperUnderBuilder
from core.testing.expect_reply import expect_reply_allowed
from tests.stories.support.story_checks import expect_lines_reply_line, expect_refusal_hook_rule, expect_updated_input_hook, expect_updated_input_reply
from tests.stories.core.modules.documents.support.trail_fixtures import viewer

PYTEST_COUNT_PATTERN = next(reader.count for reader in STOCK_READERS if reader.name == "pytest")
SERVER = HookSamples.shell("node serve.js", ShellPart("node", CommandCategory.PROCESS, ["serve.js"]))
JOURNAL = HookSamples.shell("journal task show 1", ShellPart("journal", CommandCategory.JOURNAL, ["task", "show", "1"], subcommand="task"))
TESTS = HookSamples.shell("pytest -q", ShellPart("pytest", CommandCategory.TEST_RUN, ["-q"], effects=[CommandEffect.READS_FILES]))
BUILD = HookSamples.shell("make build", ShellPart("make", CommandCategory.BUILD, ["build"]))


def test_a_shell_hook_of_the_builder_is_answered_with_the_runner_line_and_a_process_row(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    reply = story.hook("s-1", SERVER)
    expect_updated_input_reply(reply, {"command": runner_line(story, 1, "node serve.js")})
    story.expect_success("process show 1", "line: node serve.js", "state: running", "limit_seconds: 15", f"session_agent_id: {story.agent.id}")
    story.expect_text(f"hook-call show {reply.hook_call_id}", "processes.runner-rewrite: rewritten")


def test_the_agent_terminal_reads_the_call_output_through_the_viewer(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    reply = story.hook("s-1", SERVER)
    folder = story.container.get(OutputFolder)
    folder.write_start(1, "node serve.js", ["node serve.js"])
    folder.write_output(1, 1, "server started\n")
    page = viewer(story, "agents.agents", ["output", "hook-page", str(reply.hook_call_id)])
    story.expect_rows(page["lines"] == ["server started"])


def test_a_journal_only_line_has_the_same_foreground_limit(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    expect_updated_input_hook(story, "s-1", JOURNAL, {"command": runner_line(story, 1, "journal task show 1")})


@pytest.mark.parametrize("program,category", [("cat", CommandCategory.READ), ("touch", CommandCategory.EDIT), ("custom", CommandCategory.UNKNOWN)])
def test_a_read_write_or_unknown_command_gets_the_fifteen_second_limit(new_story, program, category):
    story = install_runner(new_story(fixture=BuilderStarted))
    sample = HookSamples.shell(f"{program} file", ShellPart(program, category, ["file"]))
    reply = story.hook("s-1", sample)
    story.expect_rows("--limit 15" in str(reply.updated_input))
    story.expect_text("process show 1", "limit_seconds: 15", actor=story.agent)


def test_a_test_run_and_a_build_run_in_line_and_keep_more_of_their_output(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    expect_rewritten(story.hook("s-1", TESTS), runner_line(story, 1, "pytest -q", has_long_part=True, progress_count="pytest -q --collect-only -q", progress_position=1, progress_pattern=PYTEST_COUNT_PATTERN))
    expect_rewritten(story.hook("s-1", BUILD), runner_line(story, 2, "make build", has_long_part=True))


def test_a_command_whose_last_run_went_past_the_limit_goes_to_the_background_at_once(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.hook("s-1", SERVER)
    story.run("process background 1", actor=story.agent)
    story.hook("s-1", HookSamples.sample("pre_tool_use", {"name": "Monitor", "category": "monitor", "input": {"command": "journal output monitor 1"}}).with_raw({"tool_input": {"command": "journal output monitor 1"}}))
    bus = story.container.get(Bus)
    bus.run(StartProcessPart(1, 1), story.agent, environment_id=1)
    story.advance(timedelta(seconds=40))
    bus.run(EndProcessPart(1, 1, 0), story.agent, environment_id=1)
    expect_updated_input_hook(story, "s-1", SERVER, {"command": runner_line(story, 2, "node serve.js", background=True)})


def test_the_limit_drops_to_10_seconds_while_a_message_waits_for_the_user(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    user_waits(story)
    expect_updated_input_hook(story, "s-1", SERVER, {"command": runner_line(story, 1, "node serve.js", limit=10)})


def test_a_helper_s_line_runs_through_the_runner_as_a_run_of_its_own(new_story):
    story = install_runner(new_story(fixture=HelperUnderBuilder))
    story.container.get(ShellSandbox).is_required = True
    story.hook("s-1", SERVER)
    expect_updated_input_hook(story, "sub-1", SERVER, {"command": runner_line(story, 2, "node serve.js", session="sub-1")})
    story.expect_success("process show 2", "line: node serve.js", "state: running", f"session_agent_id: {story.helper.id}")
    story.expect_success("process part-start 2 --position 1", actor=story.helper)
    story.expect_refusal("process part-end 2 --position 1 --exit-code 0", "only the agent that ran a line reports on it", actor=story.agent)


def test_a_line_with_a_parse_error_is_let_through(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.hook("s-1", SERVER)
    expect_updated_input_hook_5(story, "s-1", SERVER, {})
    story.expect_refusal("process show 2", "no process 2")


def test_a_second_rule_that_rewrites_the_hook_is_refused_and_no_process_is_kept(new_story):
    story = install_runner(new_story(SAMPLES, fixture=BuilderStarted))
    story.run("setting make samples.rewrite-coding true")
    story.expect_hook_refusal("s-1", SERVER, "processes.runner-rewrite")
    story.expect_refusal("process show 1", "no process 1")


def test_a_background_bash_call_of_claude_runs_in_the_foreground_through_the_runner(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    background = SERVER.with_raw({"tool_input": {"command": "node serve.js", "run_in_background": True, "description": "list"}})
    expect_updated_input_hook(story, "s-1", background, {"command": runner_line(story, 1, "node serve.js"), "description": "list"})


def test_without_the_runner_installed_lines_are_left_as_they_are_and_the_agent_is_told_once(new_story):
    story = new_story(fixture=BuilderStarted)
    first = story.hook("s-1", SERVER)
    expect_updated_input_reply(first, {})
    expect_lines_reply_line(first, "journal-run is not installed")
    second = story.hook("s-1", SERVER)
    expect_updated_input_reply(second, {})
    expect_lines_second_without_line(second, "journal-run is not installed")
    story.expect_refusal("process show 1", "no process 1")



def test_a_line_that_read_command_files_goes_through_the_runner_with_its_pipes_as_written(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    line = "cat src/cart.py | tail -n 3"
    reply = story.hook("s-1", HookSamples.shell(line, ShellPart("cat", CommandCategory.READ, ["src/cart.py"])))
    expect_updated_input_reply(reply, {"command": runner_line(story, 1, line, read_command=True)})
    story.expect_success("process show 1", f"line: {line}", "state: running")


def test_a_chain_of_reads_and_writes_goes_through_the_runner_as_written(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    line = "sed -n 1,5p src/cart.py && cat > notes.txt"
    reply = story.hook("s-1", HookSamples.shell(line, ShellPart("sed", CommandCategory.READ, ["-n"]), ShellPart("cat", CommandCategory.EDIT, [], output_paths=["notes.txt"])))
    expected = runner_line(story, 1, line, queue_run=False)
    expect_updated_input_reply(reply, {"command": expected})
    expect_reply_allowed(reply)
    story.expect_success("process show 1", f"line: {line}")


def test_a_read_that_went_through_the_runner_makes_no_mark(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.hook("s-1", HookSamples.shell("cat src/cart.py", ShellPart("cat", CommandCategory.READ, ["src/cart.py"])))
    story.run_listeners()
    expect_mark_count(story, 0)


def test_a_line_that_also_runs_something_else_still_goes_through_the_runner(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    line = "cat src/cart.py && pytest -q"
    reply = story.hook("s-1", HookSamples.shell(line, ShellPart("cat", CommandCategory.READ, ["src/cart.py"]), ShellPart("pytest", CommandCategory.TEST_RUN, ["-q"])))
    expect_rewritten(reply, runner_line(story, 1, line, has_long_part=True, queue_run=False, progress_count="pytest -q --collect-only -q", progress_position=2, progress_pattern=PYTEST_COUNT_PATTERN))


def test_a_read_that_never_ends_still_goes_through_the_runner(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    follow = HookSamples.shell("tail -f server.log", ShellPart("tail", CommandCategory.READ, ["-f", "server.log"], effects=[CommandEffect.READS_FILES, CommandEffect.RUNS_LONG]))
    expect_updated_input_hook_4(story, "s-1", follow)


def expect_updated_input_hook_4(story, text, follow) -> None:
    actual = story.hook(text, follow).updated_input
    assert actual, actual


def expect_lines_second_without_line(second, expected) -> None:
    actual = second.lines
    assert not any(expected in line for line in actual), actual


def expect_updated_input_hook_5(story, text, item, expected) -> None:
    actual = dict(story.hook(text, with_parse_error(item)).updated_input)
    assert actual == expected, actual
