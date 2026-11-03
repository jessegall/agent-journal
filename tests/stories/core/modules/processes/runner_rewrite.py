from datetime import timedelta

from core.base.command.bus import Bus
from core.modules.memories.commands.open_memory_mark.open_memory_mark import OpenMemoryMark
from core.modules.processes.commands.end_process_part.end_process_part import EndProcessPart
from core.modules.processes.commands.start_process_part.start_process_part import StartProcessPart
from core.base.driver.command_category import CommandCategory
from core.base.driver.command_effect import CommandEffect
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.base.driver.support.samples import SAMPLES
from tests.stories.core.modules.chat.support.mark_samples import mark_count
from tests.stories.core.modules.processes.support.process_samples import install_runner, runner_line, user_waits, with_parse_error
from tests.stories.core.support.coding_fixtures import BuilderStarted, SubagentStarted

SERVER = HookSamples.shell("node serve.js", ShellPart("node", CommandCategory.PROCESS, ["serve.js"]))
JOURNAL = HookSamples.shell("journal task show 1", ShellPart("journal", CommandCategory.JOURNAL, ["task", "show", "1"], subcommand="task"))
TESTS = HookSamples.shell("pytest -q", ShellPart("pytest", CommandCategory.TEST_RUN, ["-q"], effects=[CommandEffect.READS_FILES]))
BUILD = HookSamples.shell("make build", ShellPart("make", CommandCategory.BUILD, ["build"]))


def test_a_shell_hook_of_the_builder_is_answered_with_the_runner_line_and_a_process_row(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    reply = story.hook("s-1", SERVER)
    assert dict(reply.updated_input) == {"command": runner_line(story, 1, "node serve.js")}
    story.expect_success("process show 1", "line: node serve.js", "state: running", "limit_seconds: 15", f"agent_id: {story.agent.id}")
    story.expect_text(f"hook-call show {reply.hook_call_id}", "processes.runner-rewrite: rewritten")


def test_a_journal_only_line_has_limit_0(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    assert dict(story.hook("s-1", JOURNAL).updated_input) == {"command": runner_line(story, 1, "journal task show 1", limit=0)}


def test_a_test_run_and_a_build_go_to_the_background_at_once(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    assert dict(story.hook("s-1", TESTS).updated_input) == {"command": runner_line(story, 1, "pytest -q", background=True)}
    assert dict(story.hook("s-1", BUILD).updated_input) == {"command": runner_line(story, 2, "make build", background=True)}


def test_a_command_whose_last_run_went_past_the_limit_goes_to_the_background_at_once(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.hook("s-1", SERVER)
    story.run("process background 1", actor=story.agent)
    story.hook("s-1", HookSamples.sample("pre_tool_use", {"name": "Monitor", "category": "monitor", "input": {"command": "journal output monitor 1"}}).with_raw({"tool_input": {"command": "journal output monitor 1"}}))
    bus = story.container.get(Bus)
    bus.run(StartProcessPart(1, 1), story.agent, environment_id=1)
    story.advance(timedelta(seconds=40))
    bus.run(EndProcessPart(1, 1, 0), story.agent, environment_id=1)
    assert dict(story.hook("s-1", SERVER).updated_input) == {"command": runner_line(story, 2, "node serve.js", background=True)}


def test_the_limit_drops_to_10_seconds_while_a_message_waits_for_the_user(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    user_waits(story)
    assert dict(story.hook("s-1", SERVER).updated_input) == {"command": runner_line(story, 1, "node serve.js", limit=10)}


def test_a_subagent_s_line_is_not_rewritten_and_makes_no_process(new_story):
    story = install_runner(new_story(fixture=SubagentStarted))
    story.hook("s-1", SERVER)
    assert dict(story.hook("s-1", SERVER.with_fields(subagent="sub-1")).updated_input) == {}
    story.expect_refusal("process show 2", "no process 2")


def test_a_line_with_a_parse_error_is_let_through(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.hook("s-1", SERVER)
    assert dict(story.hook("s-1", with_parse_error(SERVER)).updated_input) == {}
    story.expect_refusal("process show 2", "no process 2")


def test_a_second_rule_that_rewrites_the_hook_is_refused_and_no_process_is_kept(new_story):
    story = install_runner(new_story(SAMPLES, fixture=BuilderStarted))
    story.run("setting make samples.rewrite-coding true")
    story.expect_hook_refusal("s-1", SERVER, "processes.runner-rewrite")
    story.expect_refusal("process show 1", "no process 1")


def test_a_background_bash_call_of_claude_runs_in_the_foreground_through_the_runner(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    background = SERVER.with_raw({"tool_input": {"command": "node serve.js", "run_in_background": True, "description": "list"}})
    assert dict(story.hook("s-1", background).updated_input) == {"command": runner_line(story, 1, "node serve.js"), "description": "list"}


def test_without_the_runner_installed_lines_are_left_as_they_are_and_the_agent_is_told_once(new_story):
    story = new_story(fixture=BuilderStarted)
    first = story.hook("s-1", SERVER)
    assert dict(first.updated_input) == {} and any("journal-run is not installed" in line for line in first.lines)
    second = story.hook("s-1", SERVER)
    assert dict(second.updated_input) == {} and not any("journal-run is not installed" in line for line in second.lines)
    story.expect_refusal("process show 1", "no process 1")


def test_an_open_memory_mark_blocks_a_run_and_lets_a_read_through(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.container.get(Bus).run(OpenMemoryMark(story.agent.id, 50), story.agent, environment_id=1)
    listing = HookSamples.shell("ls build", ShellPart("ls", CommandCategory.READ, ["build"]))
    assert not story.hook("s-1", listing).refusal
    assert story.hook("s-1", SERVER).refusal


def test_a_line_that_read_command_files_goes_through_the_runner_with_its_pipes_as_written(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    line = "cat src/cart.py | tail -n 3"
    reply = story.hook("s-1", HookSamples.shell(line, ShellPart("cat", CommandCategory.READ, ["src/cart.py"])))
    assert dict(reply.updated_input) == {"command": runner_line(story, 1, line, read_command=True)}
    story.expect_success("process show 1", f"line: {line}", "state: running")


def test_a_chain_of_reads_and_writes_goes_through_the_runner_as_written(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    line = "sed -n 1,5p src/cart.py && cat > notes.txt"
    reply = story.hook("s-1", HookSamples.shell(line, ShellPart("sed", CommandCategory.READ, ["-n"]), ShellPart("cat", CommandCategory.EDIT, [], output_paths=["notes.txt"])))
    assert dict(reply.updated_input) == {"command": runner_line(story, 1, line)}
    assert not reply.refusal
    story.expect_success("process show 1", f"line: {line}")


def test_a_read_that_went_through_the_runner_makes_no_mark(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.hook("s-1", HookSamples.shell("cat src/cart.py", ShellPart("cat", CommandCategory.READ, ["src/cart.py"])))
    story.run_listeners()
    assert mark_count(story) == 0


def test_a_line_that_also_runs_something_else_still_goes_through_the_runner(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    line = "cat src/cart.py && pytest -q"
    reply = story.hook("s-1", HookSamples.shell(line, ShellPart("cat", CommandCategory.READ, ["src/cart.py"]), ShellPart("pytest", CommandCategory.TEST_RUN, ["-q"])))
    assert dict(reply.updated_input) == {"command": runner_line(story, 1, line, background=True)}


def test_a_read_that_never_ends_still_goes_through_the_runner(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    follow = HookSamples.shell("tail -f server.log", ShellPart("tail", CommandCategory.READ, ["-f", "server.log"], effects=[CommandEffect.READS_FILES, CommandEffect.RUNS_LONG]))
    assert story.hook("s-1", follow).updated_input
