from tests.stories.support.story_checks import without_claim
from suites.coding.modules.workers.support.worker_settings import WORKER_RUN_WAIT
from engine.sandbox.shell_sandbox import ShellSandbox
from core.modules.processes.support.stock_reader import STOCK_READERS
import pytest

from engine.enums.command_category import CommandCategory
from engine.enums.command_effect import CommandEffect
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.engine.driver.support.samples import SAMPLES
from tests.stories.core.modules.processes.support.process_samples import install_runner, runner_line, user_waits, with_parse_error
from tests.stories.core.support.coding_fixtures import BuilderStarted, BuilderHelper
from engine.testing.expectations.expect_reply import expect_reply_allowed
from tests.stories.support.story_checks import expect_updated_input_hook, expect_updated_input_reply
from tests.stories.core.modules.documents.support.trail_fixtures import viewer

PYTEST_COUNT_PATTERN = next(reader.count for reader in STOCK_READERS if reader.name == "pytest")
SERVER = HookSamples.shell("node serve.js", ShellPart("node", CommandCategory.PROCESS, ["serve.js"]))
JOURNAL = HookSamples.shell("journal task show 1", ShellPart("journal", CommandCategory.JOURNAL, ["task", "show", "1"], subcommand="task"))
OUTPUT_READ = HookSamples.shell("journal output read 7 --lines 1-30", ShellPart("journal", CommandCategory.JOURNAL, ["output", "read", "7", "--lines", "1-30"], subcommand="output"))
TESTS = HookSamples.shell("pytest -q", ShellPart("pytest", CommandCategory.TEST_RUN, ["-q"], effects=[CommandEffect.READS_FILES]))
BUILD = HookSamples.shell("make build", ShellPart("make", CommandCategory.BUILD, ["build"]))


def test_the_agent_terminal_reads_the_call_output_through_the_viewer(played):
    story = install_runner(played(BuilderStarted))
    reply = story.hook("s-1", SERVER)
    story.step("run started", 1, "node serve.js", ["node serve.js"])
    story.step("run printed", 1, 1, "server started\n")
    page = viewer(story, "agents.agents", ["output", "hook-page", str(reply.hook_call_id)])
    story.expect_rows(page["lines"] == ["server started"])


@pytest.mark.parametrize("program,category,limit", [("cat", CommandCategory.READ, 0), ("touch", CommandCategory.EDIT, 0), ("custom", CommandCategory.UNKNOWN, 15)])
def test_a_read_or_a_write_runs_with_no_limit_and_an_unknown_command_gets_fifteen_seconds(played, program, category, limit):
    story = install_runner(played(BuilderStarted))
    reply = story.hook("s-1", HookSamples.shell(f"{program} file", ShellPart(program, category, ["file"])))
    story.expect_rows(f"--limit {limit} " in str(reply.updated_input), "--background" not in str(reply.updated_input))
    story.expect_text("process show 1", f"limit_seconds: {limit}", actor=story.agent)


def test_the_limit_drops_to_10_seconds_while_a_message_waits_for_the_user(played):
    story = install_runner(played(BuilderStarted))
    user_waits(story)
    expect_updated_input_hook(story, "s-1", SERVER, {"command": runner_line(story, 1, "node serve.js", limit=10)})


def test_a_helper_s_line_runs_through_the_runner_as_a_run_of_its_own(played):
    story = install_runner(played(BuilderHelper))
    story.container.get(ShellSandbox).is_required = True
    story.hook("s-1", SERVER)
    wait = story.number_default(WORKER_RUN_WAIT)
    expect_updated_input_hook(story, "sub-1", SERVER, {"command": runner_line(story, 2, "node serve.js", limit=wait, session="sub-1", queue_wait=wait, counted_queue=True)})
    story.expect_success("process show 2", "line: node serve.js", "state: running", f"session_agent_id: {story.helper.id}")
    story.expect_success("process part-start 2 --position 1", actor=story.helper)
    story.expect_refusal("process part-end 2 --position 1 --exit-code 0", "only the agent that ran a line reports on it", actor=story.agent)


def test_a_line_with_a_parse_error_is_let_through(played):
    story = install_runner(played(BuilderStarted))
    story.hook("s-1", SERVER)
    expect_updated_input_hook_5(story, "s-1", SERVER, {})
    story.expect_refusal("process show 2", "no process 2")


def test_a_second_rule_that_rewrites_the_hook_is_refused_and_no_process_is_kept(played):
    story = install_runner(played(BuilderStarted, SAMPLES))
    story.run("setting set samples.rewrite-coding true --project")
    story.expect_hook_refusal("s-1", SERVER, "processes.runner-rewrite")
    story.expect_refusal("process show 1", "no process 1")


def test_a_chain_of_reads_and_writes_goes_through_the_runner_as_written(played):
    story = install_runner(played(BuilderStarted))
    line = "sed -n 1,5p src/cart.py && cat > notes.txt"
    reply = story.hook("s-1", HookSamples.shell(line, ShellPart("sed", CommandCategory.READ, ["-n"]), ShellPart("cat", CommandCategory.EDIT, [], output_paths=["notes.txt"])))
    expected = runner_line(story, 1, line, limit=0, queue_run=False)
    expect_updated_input_reply(reply, {"command": expected})
    expect_reply_allowed(reply)
    story.expect_success("process show 1", f"line: {line}")


def expect_updated_input_hook_5(story, text, item, expected) -> None:
    actual = without_claim(story.hook(text, with_parse_error(item)).updated_input)
    assert actual == expected, actual
