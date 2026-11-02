from datetime import timedelta

from core.base.command.bus import Bus
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.commands.move_process.move_process import MoveProcess
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.commands.support.part_spec import PartSpec
from core.modules.processes.commands.read_new_output.read_new_output import ReadNewOutput

from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import end_run, ended_run, install_runner, moved_run
from tests.stories.core.support.coding_fixtures import BuilderStarted

NOTHING = HookSamples.shell("cat notes", ShellPart("cat", CommandCategory.READ, ["notes"]))
AFTER = NOTHING.with_fields(event="post_tool_use")
TESTS_REPORT = "collected 3 items\nFAILED tests/test_cart.py::test_total - assert 1 == 2\n2 failed, 1 passed in 0.4s\n"
ENDED = "output 1 ended: 2 failed 1 passed"


def lines_of(story, sample) -> list[str]:
    return list(story.hook("s-1", sample).lines)


def test_the_end_of_a_background_run_tells_the_agent_once_with_the_readers_summary(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "pytest -q")
    end_run(story, process, TESTS_REPORT, exit_code=1)
    story.advance(timedelta(seconds=1))
    assert ENDED in lines_of(story, NOTHING)
    assert ENDED not in lines_of(story, NOTHING)


def ended_lines(new_story, line, text=TESTS_REPORT, category=None):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, line, category=category)
    end_run(story, process, text)
    story.advance(timedelta(seconds=1))
    return story, process, lines_of(story, NOTHING)


def test_a_plain_command_is_not_asked_for_a_reader(new_story):
    _, _, lines = ended_lines(new_story, "grep -n word file", "one\ntwo\n")
    assert not any("no reader reads" in line for line in lines)


def test_a_chain_is_asked_for_a_reader_of_its_real_run_not_of_its_first_word(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    parts = (PartSpec("mkdir build", "mkdir", False, CommandCategory.EDIT), PartSpec("make test", "make", False, CommandCategory.TEST_RUN))
    command = StartProcess(story.agent.id, None, "mkdir build && make test", "/work/main", "zsh", CommandCategory.TEST_RUN, 30, parts)
    process = story.container.get(Bus).run(command, story.agent, environment_id=1)
    story.container.get(Bus).run(MoveProcess(process.id), story.agent, environment_id=1)
    end_run(story, process, "one\ntwo\n")
    story.advance(timedelta(seconds=1))
    lines = lines_of(story, NOTHING)
    assert any("no reader reads make yet" in line for line in lines)
    assert not any("no reader reads mkdir" in line for line in lines)


def test_a_run_no_reader_reads_tells_the_agent_to_draft_one_once(new_story):
    story, _, lines = ended_lines(new_story, "./deploy.sh staging", "uploading\nall done\n", category=CommandCategory.BUILD)
    assert any("no reader reads deploy.sh yet: journal reader add deploy.sh" in line for line in lines)
    assert not any("no reader reads" in line for line in lines_of(story, NOTHING))


def test_a_shell_loop_is_not_told_to_draft_a_reader_for_its_keyword(new_story):
    _, _, lines = ended_lines(new_story, "for i in 1 2 3; do ./deploy.sh; done", "uploading\n")
    assert not any("no reader reads" in line for line in lines)


def test_a_shell_running_a_script_is_not_told_to_draft_a_reader_for_the_shell(new_story):
    _, _, lines = ended_lines(new_story, "bash install.sh", "registry: rewritten\n", category=CommandCategory.BUILD)
    assert not any("no reader reads" in line for line in lines)


def test_a_run_a_reader_reads_gets_no_advice(new_story):
    _, _, lines = ended_lines(new_story, "pytest -q")
    assert ENDED in lines
    assert not any("no reader reads" in line for line in lines)


def test_a_run_that_printed_nothing_gets_no_advice(new_story):
    _, _, lines = ended_lines(new_story, "./deploy.sh staging", "")
    assert not any("no reader reads" in line for line in lines)


def test_a_run_that_ended_in_the_foreground_is_not_told(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    ended_run(story, "pytest -q", TESTS_REPORT, exit_code=1)
    assert not any("ended" in line for line in lines_of(story, NOTHING))


def test_a_reader_that_picks_no_line_is_told_to_fix_its_pattern(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('reader add deploys --commands "./deploy*" --lines "NOTHING MATCHES THIS"', actor=story.agent)
    process = moved_run(story, "./deploy.sh staging")
    end_run(story, process, "uploading\nstill going\nhalf way\nnearly\nall done\n")
    story.container.get(Bus).run(ReadNewOutput(process.id, True), story.agent, environment_id=1)
    story.advance(timedelta(seconds=1))
    assert any("reader deploys picked none" in line for line in lines_of(story, NOTHING))


def test_a_reader_that_keeps_nearly_every_line_is_told_to_narrow_and_one_with_no_summary_to_add_one(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('reader add deploys --commands "./deploy*" --lines "step" --summary "NOTHING MATCHES THIS"', actor=story.agent)
    process = moved_run(story, "./deploy.sh staging")
    end_run(story, process, "".join(f"step {number}\n" for number in range(60)))
    story.container.get(Bus).run(ReadNewOutput(process.id, True), story.agent, environment_id=1)
    story.advance(timedelta(seconds=1))
    lines = lines_of(story, NOTHING)
    assert any("reader deploys kept 60 of 60 lines" in line for line in lines)
    assert any("reader deploys found no summary" in line for line in lines)


def test_a_run_printing_a_count_with_no_progress_pattern_is_told_to_add_one(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('reader add deploys --commands "./deploy*" --lines "step"', actor=story.agent)
    process = moved_run(story, "./deploy.sh staging")
    end_run(story, process, "step 3/9\nstep 9/9\n")
    story.container.get(Bus).run(ReadNewOutput(process.id, True), story.agent, environment_id=1)
    story.advance(timedelta(seconds=1))
    assert any("prints a count with no bar" in line for line in lines_of(story, NOTHING))


def test_a_run_that_prints_nothing_for_30_seconds_is_told_it_may_buffer(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "./deploy.sh staging")
    assert not any("may buffer" in line for line in lines_of(story, NOTHING))
    story.advance(timedelta(seconds=31))
    assert any(f"output {process.id} printed nothing for 30 seconds" in line for line in lines_of(story, NOTHING))


def test_a_program_that_has_a_reader_is_not_asked_for_one(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "pytest tests/one.py && echo done", category=CommandCategory.TEST_RUN)
    story.container.get(OutputFolder).write_start(process.id, process.line, [process.line])
    end_run(story, process, "one\ntwo\n")
    story.advance(timedelta(seconds=1))
    assert not any("no reader reads pytest" in line for line in lines_of(story, NOTHING))


def test_a_reader_is_not_judged_on_a_chain_of_commands(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('reader add deploys --commands "./deploy*" --lines "NOTHING MATCHES THIS"', actor=story.agent)
    process = moved_run(story, "./deploy.sh staging && echo one && echo two")
    end_run(story, process, "uploading\nstill going\nhalf way\nnearly\nall done\n")
    story.container.get(Bus).run(ReadNewOutput(process.id, True), story.agent, environment_id=1)
    story.advance(timedelta(seconds=1))
    assert not any("reader deploys picked none" in line for line in lines_of(story, NOTHING))
