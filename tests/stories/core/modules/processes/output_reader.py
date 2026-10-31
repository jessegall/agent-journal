import stat
from unittest.mock import patch

from core.base.command.bus import Bus
from core.modules.processes.commands.end_process import EndProcess
from core.modules.processes.commands.end_process_part import EndProcessPart
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.reader_run import ReaderRun
from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import BYTES_LONG, install_runner, start_process, tick
from tests.stories.core.support.coding_fixtures import BuilderStarted

AFTER = HookSamples.shell("cat notes", ShellPart("cat", CommandCategory.READ, ["notes"])).with_fields(event="post_tool_use")
READER = 'reader add steps --commands "make*" --lines "FAILED|error" --progress "\\[ *([0-9]+)%\\]" --summary "([0-9]+ failed)"'
FIRST = "building\nFAILED a\n[ 40%]\n"
SECOND = "error b\n[ 80%]\n3 failed\n"


def append(story, process_id: int, text: str) -> None:
    folder = story.container.get(OutputFolder)
    folder.write_output(process_id, 1, folder.output(process_id, 1) + text)


def reader_texts(reader_mock) -> list[str]:
    return [call.args[2] for call in reader_mock.call_args_list]


def test_a_long_run_read_twice_runs_the_reader_once_for_each_new_chunk(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run(READER, actor=story.agent)
    process = start_process(story, "make test")
    with patch.object(ReaderRun, "lines", autospec=True, side_effect=ReaderRun.lines) as reader_mock:
        append(story, process.id, FIRST)
        story.hook("s-1", AFTER)
        assert reader_texts(reader_mock) == []
        tick(story)
        story.hook("s-1", AFTER)
        assert reader_texts(reader_mock) == [FIRST]
        story.run(f"output read {process.id} --summary", actor=story.agent)
        story.run(f"output read {process.id} --summary", actor=story.agent)
        assert reader_texts(reader_mock) == [FIRST]
        append(story, process.id, SECOND)
        story.hook("s-1", AFTER)
        assert reader_texts(reader_mock) == [FIRST]
        tick(story)
        assert reader_texts(reader_mock) == [FIRST, SECOND]


def test_the_readers_lines_are_kept_in_a_file_of_the_outputs_folder_with_their_numbers(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run(READER, actor=story.agent)
    process = start_process(story, "make test")
    append(story, process.id, FIRST)
    tick(story)
    folder = story.container.get(OutputFolder)
    assert folder.reader_lines(process.id) == ["2: FAILED a"]
    append(story, process.id, SECOND)
    tick(story)
    assert folder.reader_lines(process.id) == ["2: FAILED a", "4: error b"]
    story.expect_text(f"output read {process.id} --summary", "2: FAILED a", "4: error b", "summary: 3 failed", actor=story.agent)


def test_the_output_keeps_its_reader_the_progress_and_the_summary_as_fields(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    reader_id = story.new_row_id(READER, actor=story.agent)
    process = start_process(story, "make test")
    story.run('reader add later --commands "make*" --lines "x"', actor=story.agent)
    story.run("reader default later", actor=story.agent)
    append(story, process.id, FIRST)
    tick(story)
    story.expect_text(f"output show {process.id}", f"reader_id: {reader_id}", "progress: 40", "read_lines: 3", actor=story.agent)
    append(story, process.id, SECOND)
    tick(story)
    story.expect_text(f"output show {process.id}", f"reader_id: {reader_id}", "progress: 80", "reader_summary: 3 failed", actor=story.agent)


def test_no_rule_reads_the_whole_output_file_when_a_hook_comes(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run(READER, actor=story.agent)
    process = start_process(story, "make test")
    story.run(f"output watch {process.id}", actor=story.agent)
    append(story, process.id, FIRST)
    with patch.object(OutputFolder, "all_output", autospec=True, side_effect=AssertionError("a rule read the whole output")):
        tick(story)
        story.hook("s-1", AFTER)
        tick(story)
        story.hook("s-1", AFTER)


def test_a_script_reader_runs_once_when_the_output_ends(new_story, tmp_path):
    story = install_runner(new_story(fixture=BuilderStarted))
    script = tmp_path / "read.sh"
    script.write_text("#!/bin/sh\ngrep -n FAILED\n")
    script.chmod(script.stat().st_mode | stat.S_IXUSR)
    story.run(f'reader add scripted --commands "make*" --script {script}', actor=story.agent)
    process = start_process(story, "make test")
    append(story, process.id, "ok\nFAILED a\n")
    with patch.object(ReaderRun, "script_lines", autospec=True, side_effect=ReaderRun.script_lines) as reader_mock:
        tick(story)
        assert reader_mock.call_count == 0
        bus = story.container.get(Bus)
        bus.run(EndProcessPart(process.id, 1, 0), story.agent, environment_id=1)
        bus.run(EndProcess(process.id, 0, BYTES_LONG, 2), story.agent, environment_id=1)
        assert reader_mock.call_count == 1
    assert story.container.get(OutputFolder).reader_lines(process.id) == ["2:FAILED a"]
