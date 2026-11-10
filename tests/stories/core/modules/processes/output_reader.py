from dataclasses import replace
from core.modules.processes.models.reader import Reader
from engine.query.queries import Queries
import stat
import pytest
from unittest.mock import patch

from engine.command.bus import Bus
from engine.database.database import Database
from core.modules.processes.commands.end_process.end_process import EndProcess
from core.modules.processes.commands.end_process_part.end_process_part import EndProcessPart
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.reader_run import ReaderRun
from core.modules.processes.support.reader_step import ReaderStep
from core.modules.processes.ticks.output_reading import OutputReading
from engine.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import BYTES_LONG, install_runner, start_process, tick
from tests.stories.core.support.coding_fixtures import BuilderStarted
from core.testing.expect_row import expect_row

AFTER = HookSamples.shell("cat notes", ShellPart("cat", CommandCategory.READ, ["notes"])).with_fields(event="post_tool_use")
READER = 'reader add steps --commands "make*" --lines "FAILED|error" --progress "\\[ *([0-9]+)%\\]" --summary "([0-9]+ failed)"'
FIRST = "building\nFAILED a\n[ 40%]\n"
SECOND = "error b\n[ 80%]\n3 failed\n"


def append(story, process_id: int, text: str) -> None:
    folder = story.container.get(OutputFolder)
    folder.write_output(process_id, 1, folder.output(process_id, 1) + text)


def reader_texts(reader_mock) -> list[str]:
    return [call.args[2] for call in reader_mock.call_args_list]


@pytest.mark.parametrize("scripted", [False, True])
def test_a_running_output_keeps_its_count_for_pattern_and_script_readers(new_story, tmp_path, scripted):
    story = install_runner(new_story(fixture=BuilderStarted))
    script = tmp_path / "read.sh"
    script.write_text("#!/bin/sh\ncat\n")
    script.chmod(script.stat().st_mode | stat.S_IXUSR)
    lines = f"--script {script}" if scripted else '--lines "FAILED"'
    story.expect_success(f'reader add counted --commands "make*" {lines} --count "^collected ([0-9]+) items" --step "[.FE]"', actor=story.agent)
    process = start_process(story, "make test")
    append(story, process.id, "collected ")
    tick(story)
    story.expect_text(f"output show {process.id}", "test_count: 0", actor=story.agent)
    append(story, process.id, "4 items\n.F\n")
    tick(story)
    story.expect_text(f"process show {process.id}", "state: running", "progress: 50", actor=story.agent)
    story.expect_text(f"output show {process.id}", "test_count: 4", "steps_passed: 1", "steps_failed: 1", actor=story.agent)
    if scripted:
        expect_reader_lines(story, process, [])
    append(story, process.id, ".\n")
    tick(story)
    story.expect_text(f"output show {process.id}", "test_count: 4", "progress: 75", actor=story.agent)
    bus = story.container.get(Bus)
    bus.run(EndProcessPart(process.id, 1, 0), story.agent, environment_id=1)
    bus.run(EndProcess(process.id, 0, BYTES_LONG, 4), story.agent, environment_id=1)
    story.expect_text(f"output show {process.id}", "test_count: 4", "steps_passed: 2", "steps_failed: 1", actor=story.agent)
    if scripted:
        expect_reader_lines(story, process, ["collected 4 items", ".F", "."])


def test_a_long_run_read_twice_runs_the_reader_once_for_each_new_chunk(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run(READER, actor=story.agent)
    process = start_process(story, "make test")
    with patch.object(ReaderRun, "lines", autospec=True, side_effect=ReaderRun.lines) as reader_mock:
        append(story, process.id, FIRST)
        story.hook("s-1", AFTER)
        expect_reader_texts(reader_mock, [])
        tick(story)
        story.hook("s-1", AFTER)
        expect_reader_texts(reader_mock, [FIRST])
        story.run(f"output read {process.id} --summary", actor=story.agent)
        story.run(f"output read {process.id} --summary", actor=story.agent)
        expect_reader_texts(reader_mock, [FIRST])
        append(story, process.id, SECOND)
        story.hook("s-1", AFTER)
        expect_reader_texts(reader_mock, [FIRST])
        tick(story)
        expect_reader_texts(reader_mock, [FIRST, SECOND])


def test_the_readers_lines_are_kept_in_a_file_of_the_outputs_folder_with_their_numbers(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run(READER, actor=story.agent)
    process = start_process(story, "make test")
    append(story, process.id, FIRST)
    tick(story)
    folder = story.container.get(OutputFolder)
    expect_reader_lines_folder(folder, process, ["2: FAILED a"])
    append(story, process.id, SECOND)
    tick(story)
    expect_reader_lines_folder(folder, process, ["2: FAILED a", "4: error b"])
    story.expect_text(f"output read {process.id} --summary", "2: FAILED a", "4: error b", "summary: 3 failed", actor=story.agent)


def test_a_progress_of_two_numbers_is_done_out_of_total(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.expect_success('reader add counted --commands "make*" --lines "FAILED" --progress "^reading ([0-9]+)/([0-9]+)"', actor=story.agent)
    process = start_process(story, "make test")
    append(story, process.id, "reading 1250/5000\n")
    tick(story)
    story.expect_text(f"output show {process.id}", "progress: 25", actor=story.agent)
    append(story, process.id, "reading 2500/5000\n")
    tick(story)
    story.expect_text(f"output show {process.id}", "progress: 50", actor=story.agent)


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
        expect_row(reader_mock, call_count=0)
        bus = story.container.get(Bus)
        bus.run(EndProcessPart(process.id, 1, 0), story.agent, environment_id=1)
        bus.run(EndProcess(process.id, 0, BYTES_LONG, 2), story.agent, environment_id=1)
        expect_row(reader_mock, call_count=1)
    expect_reader_lines(story, process, ["2:FAILED a"])


def test_a_summary_pattern_with_a_group_inside_a_group_says_each_word_once(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    stock = story.container.get(Queries).query(Reader).filter(name="pytest").page(1, 1).rows[0]
    reader = replace(stock, summary_pattern="([0-9]+ (passed|failed).*)")
    expect_summary(story, reader, "13 passed in 2.94s\n", "13 passed in 2.94s")


def expect_reader_texts(reader_mock, expected) -> None:
    actual = reader_texts(reader_mock)
    assert actual == expected, actual


def expect_summary(story, reader, text, expected) -> None:
    actual = story.container.get(ReaderRun).summary(reader, text)
    assert actual == expected, actual


def expect_reader_lines(story, process, expected) -> None:
    actual = story.container.get(OutputFolder).reader_lines(process.id)
    assert actual == expected, actual


def expect_reader_lines_folder(folder, process, expected) -> None:
    actual = folder.reader_lines(process.id)
    assert actual == expected, actual


def test_a_tick_reads_new_output_with_no_open_transactions(new_story, monkeypatch):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('reader add watched --commands "make*" --lines "FAILED"', actor=story.agent)
    process = start_process(story, "make test")
    database, advance, open_transactions = story.container.get(Database), ReaderStep.advance, []

    def watched_advance(step, *arguments):
        open_transactions.append(database.has_transaction)
        return advance(step, *arguments)

    monkeypatch.setattr(ReaderStep, "advance", watched_advance)
    append(story, process.id, FIRST)
    tick(story)
    story.expect_rows(open_transactions == [False])



@pytest.mark.parametrize("output,listing,status,count,progress", [
    (".F", "tests/cart.py: 4\n", 0, 4, 50),
    (".", "listing failed\n", 1, 0, 0),
    ("collected 4 items\n.", "", -1, 4, 25),
])
def test_a_test_run_uses_its_own_count_or_a_background_listing(new_story, output, listing, status, count, progress):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = start_process(story, "pytest -n 2 -q tests/cart.py", category=CommandCategory.TEST_RUN)
    append(story, process.id, output)
    OutputReading().read(story.container)
    folder = story.container.get(OutputFolder)
    if status >= 0:
        folder.write_progress_count(process.id, listing, status)
        OutputReading().read(story.container)
    else:
        story.expect_rows(folder.has_progress_count(process.id))
    story.expect_text(f"output show {process.id}", f"test_count: {count}", f"progress: {progress}", actor=story.agent)
    if status > 0:
        story.expect_text(f"process show {process.id}", "state: running", actor=story.agent)
