import os

import pytest

from datetime import timedelta

from engine.actor.actor import Actor
from engine.command.bus import Bus
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.commands.end_process_part.end_process_part import EndProcessPart
from core.modules.processes.commands.start_process_part.start_process_part import StartProcessPart
from core.modules.processes.commands.move_process.move_process import MoveProcess
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.commands.support.part_spec import PartSpec
from core.modules.processes.commands.read_new_output.read_new_output import ReadNewOutput
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.support.ended_output_text import EndedOutputText
from core.modules.processes.support.run_visibility import RunVisibility
from core.modules.processes.rules.silent_run_rule import STALLED_SECONDS

from core.base.driver.command_category import CommandCategory
from core.modules.claude_code.providers.claude_code_provider import ClaudeCodeProvider
from core.testing.expect_reply import expect_absent_reply_line, expect_reply_line
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.processes.support.process_samples import end_run, ended_run, install_runner, moved_run, start_process
from tests.stories.core.support.coding_fixtures import BuilderStarted, UserBuilder
from tests.stories.support.story_checks import expect_value_line, expect_value_with, expect_value_without_line

READ_NOTES = HookSamples.shell("cat notes", ShellPart("cat", CommandCategory.READ, ["notes"]))
AFTER = READ_NOTES.with_fields(event="post_tool_use")
TESTS_REPORT = "collected 3 items\nFAILED tests/test_cart.py::test_total - assert 1 == 2\n2 failed, 1 passed in 0.4s\n"
ENDED = "output 1 ended"


def read_lines(story, sample) -> list[str]:
    return list(story.hook("s-1", sample).lines)


def test_the_end_of_a_background_run_tells_the_agent_once_to_read_its_summary(ended_test_output):
    story, process = ended_test_output
    expect_lines(story, READ_NOTES, ENDED)
    story.expect_text("output read 1 --summary", "2 failed, 1 passed", actor=story.agent)
    expect_absent_lines(story, READ_NOTES, ENDED)


def test_one_hook_reuses_the_ended_runs_output(ended_test_output):
    story, process = ended_test_output
    outputs = story.container.get(OutputQuery)
    visibility = story.container.get(RunVisibility)
    with story.repeated_work.request():
        rows = [(outputs.process_output(process.id), visibility.parts(process.id)) for _ in range(12)]
    story.expect_rows(all(row is not None and row.process_id == process.id and parts for row, parts in rows))


def test_several_ended_runs_read_their_outputs_and_parts_once_each(ended_test_output):
    story, first = ended_test_output
    processes = (first, *[ended_run(story, f"pytest -q tests/test_{number}.py", TESTS_REPORT, exit_code=1) for number in range(11)])
    with story.repeated_work.request():
        nudges = story.container.get(EndedOutputText).nudges(processes)
    story.expect_rows(len(nudges) >= len(processes))


def test_only_the_part_that_ran_past_the_limit_sends_a_later_line_to_the_background(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    bus = story.container.get(Bus)
    parts = (PartSpec("make build", "make", False, CommandCategory.PROCESS), PartSpec("cut -c1-9", "cut", False, CommandCategory.PROCESS))
    process = bus.run(StartProcess(story.agent.id, None, "make build && cut -c1-9", "/work/main", "zsh", CommandCategory.PROCESS, 15, parts), Actor.core(), environment_id=1)
    bus.run(MoveProcess(process.id), Actor.core(), environment_id=1)
    bus.run(StartProcessPart(process.id, 1), story.agent, environment_id=1)
    story.advance(timedelta(seconds=40))
    bus.run(EndProcessPart(process.id, 1, 0), story.agent, environment_id=1)
    bus.run(StartProcessPart(process.id, 2), story.agent, environment_id=1)
    bus.run(EndProcessPart(process.id, 2, 0), story.agent, environment_id=1)
    expect_updated_input_hook_with(story, "s-1", "make build", "make", "build", "--background")
    expect_updated_input_hook_without(story, "s-1", "cut -c1-9", "cut", "-c1-9", "--background")


def test_a_moved_run_with_work_going_on_needs_no_monitor(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    moved_run(story, "pytest -q")
    story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"))
    story.expect_hook_allowed("s-1", HookSamples.tool_use("ToolSearch", ClaudeCodeProvider.tool_categories["ToolSearch"], [], None))




def ended_lines(new_story, line, text=TESTS_REPORT, category=None):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, line, category=category)
    end_run(story, process, text)
    story.advance(timedelta(seconds=1))
    return story, process, read_lines(story, READ_NOTES)


def test_a_plain_command_is_not_asked_for_a_reader(ended_plain_output):
    lines = ended_plain_output
    expect_value_without_line(lines, "no reader reads")


def test_a_chain_is_asked_for_a_reader_of_its_real_run_not_of_its_first_word(ended_chain_output):
    story, parts, command, process, lines = ended_chain_output
    expect_value_line(lines, "no reader reads cart-suite yet")
    expect_value_without_line(lines, "no reader reads mkdir")


def test_a_shell_loop_is_not_told_to_draft_a_reader_for_its_keyword(ended_loop_output):
    lines = ended_loop_output
    expect_value_without_line(lines, "no reader reads")


def test_a_shell_running_a_script_is_not_told_to_draft_a_reader_for_the_shell(ended_script_output):
    lines = ended_script_output
    expect_value_without_line(lines, "no reader reads")


def test_a_run_a_reader_reads_gets_no_advice(read_test_output):
    lines = read_test_output
    expect_value_with(lines, ENDED)
    expect_value_without_line(lines, "no reader reads")


def test_a_run_that_printed_nothing_gets_no_advice(empty_build_output):
    lines = empty_build_output
    expect_value_without_line(lines, "no reader reads")


def test_a_reader_that_keeps_nearly_every_line_is_told_to_narrow_and_one_with_no_summary_to_add_one(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('reader add deploys --commands "./deploy*" --lines "step" --summary "NOTHING MATCHES THIS"', actor=story.agent)
    process = moved_run(story, "./deploy.sh staging", category=CommandCategory.BUILD)
    end_run(story, process, "".join(f"step {number}\n" for number in range(60)))
    story.container.get(Bus).run(ReadNewOutput(process.id, True), story.agent, environment_id=1)
    story.advance(timedelta(seconds=1))
    lines = read_lines(story, READ_NOTES)
    expect_value_line(lines, "reader deploys kept 60 of 60 lines")
    expect_value_line(lines, "reader deploys found no summary")


def test_a_test_run_whose_reader_finds_progress_only_on_its_last_line_is_told_to_improve_it(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run("""reader add dots --commands "./dots*" --lines "Tests" --progress "Tests +([0-9]+) of ([0-9]+)" """, actor=story.agent)
    process = moved_run(story, "./dots.sh", category=CommandCategory.TEST_RUN)
    end_run(story, process, "".join("........\n" for _ in range(60)) + "Tests 60 of 60\n")
    story.container.get(Bus).run(ReadNewOutput(process.id, True), story.agent, environment_id=1)
    story.advance(timedelta(seconds=1))
    expect_lines(story, READ_NOTES, "ran with no progress")


def test_a_run_printing_a_count_with_no_progress_pattern_is_told_to_add_one(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('reader add deploys --commands "./deploy*" --lines "step"', actor=story.agent)
    process = moved_run(story, "./deploy.sh staging", category=CommandCategory.BUILD)
    end_run(story, process, "step 3/9\nstep 9/9\n")
    story.container.get(Bus).run(ReadNewOutput(process.id, True), story.agent, environment_id=1)
    story.advance(timedelta(seconds=1))
    expect_lines(story, READ_NOTES, "ran with no progress")


class SilentVitestRun(StoryFixture):
    """A vitest run has moved to the background and printed nothing yet."""

    parent = BuilderStarted

    def steps(self, story: Story) -> None:
        install_runner(story)
        moved_run(story, "npx vitest run", category=CommandCategory.TEST_RUN)


class SavedBuildMoved(StoryFixture):
    """A saved build has moved to the background and printed nothing yet."""

    parent = BuilderStarted

    def steps(self, story: Story) -> None:
        install_runner(story)
        moved_run(story, "journal build-npm --tail 5", category=CommandCategory.BUILD)


def expect_streaming_line(story, text: str) -> None:
    lines = read_lines(story, READ_NOTES)
    assert any(text in line for line in lines), lines


def expect_without_hint(story) -> None:
    lines = read_lines(story, READ_NOTES)
    assert not any("not streaming" in line or "still runs" in line for line in lines), lines


def expect_without_failure_line(story) -> None:
    lines = read_lines(story, READ_NOTES)
    assert not any("failed and printed nothing" in line for line in lines), lines


def test_a_python_run_that_prints_nothing_for_30_seconds_is_told_it_is_not_streaming(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "python3 tools/deploy.py staging", category=CommandCategory.BUILD)
    expect_without_hint(story)
    story.advance(timedelta(seconds=31))
    expect_streaming_line(story, f"output {process.id} printed nothing for 30 seconds, so its output is not streaming: it may hold its output back")


def test_a_silent_test_gets_its_hint_once_and_again_when_it_stops_printing(new_story):
    story = new_story(fixture=SilentVitestRun)
    story.advance(timedelta(seconds=31))
    expect_streaming_line(story, "run vitest with --reporter=verbose")
    story.advance(timedelta(seconds=31))
    expect_without_hint(story)
    folder = story.container.get(OutputFolder)
    process_id = next(iter(story.container.get(ProcessQuery).agent(story.agent.id).running().all_rows())).id
    folder.write_output(process_id, 1, "first line\n")
    modified_at = story.clock.timestamp().value.timestamp() - STALLED_SECONDS
    os.utime(folder.home.folder / "processes" / str(process_id) / "1.out", (modified_at, modified_at))
    expect_streaming_line(story, f"output {process_id} has written nothing for {STALLED_SECONDS} seconds and still runs: run vitest with --reporter=verbose")


def test_a_silent_saved_command_is_told_to_fix_its_alias(new_story):
    story = new_story(fixture=SavedBuildMoved)
    story.expect_text("process show 1", "state: background", actor=story.agent)
    story.advance(timedelta(seconds=31))
    expect_streaming_line(story, "alias build-npm printed nothing for 30 seconds: make it print each step; this run stays silent, the next shows its steps")


def test_a_saved_command_that_fails_and_prints_nothing_is_told_to_fix_the_saved_command(new_story):
    story = new_story(fixture=SavedBuildMoved)
    story.expect_success("process part-end 1 --position 1 --exit-code 2", actor=story.agent)
    story.expect_success("process end 1 --exit-code 2 --bytes 0 --lines 0", actor=story.agent)
    expect_streaming_line(story, "saved command build-npm failed and printed nothing")


def test_a_saved_command_that_fails_with_output_is_only_told_how_it_ended(new_story):
    story = new_story(fixture=SavedBuildMoved)
    end_run(story, story.container.get(ProcessQuery).find(1), "the build broke\n", exit_code=2)
    expect_without_failure_line(story)


def test_a_program_that_has_a_reader_is_not_asked_for_one(program_reader_output):
    story, process = program_reader_output
    expect_absent_lines(story, READ_NOTES, "no reader reads pytest")


def test_a_reader_is_judged_on_a_chain_of_commands_by_the_part_it_reads(chain_reader_output):
    story, process = chain_reader_output
    expect_lines(story, READ_NOTES, "reader deploys picked none")


def test_a_chains_reader_reads_only_its_part_and_gives_the_card_its_progress(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('reader add tests --commands "pytest*" --lines "FAILED" --progress "\\[ *([0-9]+)%\\]"', actor=story.agent)
    parts = (PartSpec("grep -n word notes", "grep", False, CommandCategory.SEARCH), PartSpec("pytest -q -n 4", "pytest", False, CommandCategory.TEST_RUN))
    bus = story.container.get(Bus)
    process = bus.run(StartProcess(story.agent.id, None, "grep -n word notes; pytest -q -n 4", "/work/main", "zsh", CommandCategory.TEST_RUN, 30, parts), story.agent, environment_id=1)
    folder = story.container.get(OutputFolder)
    folder.write_output(process.id, 1, "FAILED in a note [ 90%]\n")
    folder.write_output(process.id, 2, "..... [ 40%]\n")
    bus.run(ReadNewOutput(process.id, False), story.agent, environment_id=1)
    story.expect_text(f"process show {process.id}", "progress: 40", actor=story.agent)


def test_a_persons_message_asks_the_main_agents_foreground_run_to_move_to_the_background(new_story):
    story = new_story(fixture=UserBuilder)
    process = start_process(story, "sleep 60")
    folder = story.container.get(OutputFolder)
    expect_folder(folder, process, "move", "")
    story.run('message send "are you there" --environment main', actor=story.user)
    story.run_listeners()
    expect_folder(folder, process, "move", "1")


@pytest.fixture
def deploy_reader(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('reader add deploys --commands "./deploy*" --lines "NOTHING MATCHES THIS"', actor=story.agent)
    return story


@pytest.fixture
def ended_test_output(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "pytest -q")
    end_run(story, process, TESTS_REPORT, exit_code=1)
    story.advance(timedelta(seconds=1))
    return story, process


@pytest.fixture
def ended_plain_output(new_story):
    _, _, lines = ended_lines(new_story, "grep -n word file", "one\ntwo\n")
    return lines


@pytest.fixture
def ended_chain_output(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    parts = (PartSpec("mkdir build", "mkdir", False, CommandCategory.EDIT), PartSpec("cart-suite test", "cart-suite", False, CommandCategory.TEST_RUN))
    command = StartProcess(story.agent.id, None, "mkdir build && cart-suite test", "/work/main", "zsh", CommandCategory.TEST_RUN, 30, parts)
    process = story.container.get(Bus).run(command, story.agent, environment_id=1)
    story.container.get(Bus).run(MoveProcess(process.id), story.agent, environment_id=1)
    end_run(story, process, "one\ntwo\n")
    story.advance(timedelta(seconds=1))
    lines = read_lines(story, READ_NOTES)
    return story, parts, command, process, lines


@pytest.fixture
def unread_build_output(new_story):
    story, _, lines = ended_lines(new_story, "./deploy.sh staging", "uploading\nall done\n", category=CommandCategory.BUILD)
    return story, lines


@pytest.fixture
def ended_loop_output(new_story):
    _, _, lines = ended_lines(new_story, "for i in 1 2 3; do ./deploy.sh; done", "uploading\n")
    return lines


@pytest.fixture
def ended_script_output(new_story):
    _, _, lines = ended_lines(new_story, "bash install.sh", "registry: rewritten\n", category=CommandCategory.BUILD)
    return lines


@pytest.fixture
def read_test_output(new_story):
    _, _, lines = ended_lines(new_story, "pytest -q")
    return lines


@pytest.fixture
def empty_build_output(new_story):
    _, _, lines = ended_lines(new_story, "./deploy.sh staging", "")
    return lines


@pytest.fixture
def unmatched_reader_output(deploy_reader):
    story = deploy_reader
    process = moved_run(story, "./deploy.sh staging", category=CommandCategory.BUILD)
    end_run(story, process, "uploading\nstill going\nhalf way\nnearly\nall done\n")
    story.container.get(Bus).run(ReadNewOutput(process.id, True), story.agent, environment_id=1)
    story.advance(timedelta(seconds=1))
    return story, process


@pytest.fixture
def program_reader_output(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "pytest tests/one.py && echo done", category=CommandCategory.TEST_RUN)
    story.container.get(OutputFolder).write_start(process.id, process.line, [process.line])
    end_run(story, process, "one\ntwo\n")
    story.advance(timedelta(seconds=1))
    return story, process


@pytest.fixture
def chain_reader_output(deploy_reader):
    story = deploy_reader
    process = moved_run(story, "./deploy.sh staging && echo one && echo two", category=CommandCategory.BUILD)
    end_run(story, process, "uploading\nstill going\nhalf way\nnearly\nall done\n")
    story.container.get(Bus).run(ReadNewOutput(process.id, True), story.agent, environment_id=1)
    story.advance(timedelta(seconds=1))
    return story, process


@pytest.fixture
def unshown_output(deploy_reader):
    story = deploy_reader
    process = moved_run(story, "./deploy.sh staging")
    end_run(story, process, "uploading\nstill going\nhalf way\nnearly\nall done\n")
    story.container.get(Bus).run(ReadNewOutput(process.id, True), story.agent, environment_id=1)
    story.advance(timedelta(seconds=1))
    return story, process


def expect_lines(story, sample, expected) -> None:
    expect_reply_line(story.hook("s-1", sample), expected)


def expect_absent_lines(story, sample, expected) -> None:
    expect_absent_reply_line(story.hook("s-1", sample), expected)


def expect_value_10(story, process, text, expected) -> None:
    actual = story.container.get(OutputFolder).text(process.id, text)
    assert actual == expected, actual


def expect_folder(folder, process, text, expected) -> None:
    actual = folder.text(process.id, text)
    assert actual == expected, actual


def expect_updated_input_hook_without(story, text, text_2, text_3, text_4, expected) -> None:
    actual = str(story.hook(text, HookSamples.shell(text_2, ShellPart(text_3, CommandCategory.PROCESS, [text_4]))).updated_input)
    assert expected not in actual, actual


def expect_updated_input_hook_with(story, text, text_2, text_3, text_4, expected) -> None:
    actual = str(story.hook(text, HookSamples.shell(text_2, ShellPart(text_3, CommandCategory.PROCESS, [text_4]))).updated_input)
    assert expected in actual, actual
