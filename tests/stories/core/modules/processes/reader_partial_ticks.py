from unittest.mock import patch

from core.base.database.database import Database
from core.base.database.statement import Statement
from core.modules.processes.support.grown_outputs import GrownOutputs
from core.modules.processes.support.output_folder import OutputFolder
from tests.stories.core.modules.processes.output_reader import append
from tests.stories.core.modules.processes.support.process_samples import install_runner, start_process, tick
from tests.stories.core.support.coding_fixtures import BuilderStarted

DOTS_READER = 'reader add dots --commands "make*" --lines "ERROR" --count "^collected ([0-9]+) items" --step "[.F]"'
NUMBERED_READER = 'reader add numbered --commands "make*" --lines "FAILED" --step "[.F]"'
BYTES_READER = 'reader add bytes --commands "make*" --lines "line 2000" --count "^collected ([0-9]+) items" --step "[.F]"'
BULK = "".join(f"line {number}\n" for number in range(1, 2001))


def output_version(story, process) -> int:
    return story.container.get(Database).rows(Statement("SELECT version FROM outputs WHERE process_id = ?", [process.id]))[0]["version"]


def started_run(new_story, reader: str):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.expect_success(reader, actor=story.agent)
    return story, start_process(story, "make test")


def test_dots_with_no_newline_move_the_progress_and_write_the_row_once_per_change(new_story):
    story, process = started_run(new_story, DOTS_READER)
    append(story, process.id, "collected 10 items\n..")
    tick(story)
    story.expect_text(f"output show {process.id}", "progress: 20", "steps_passed: 0", actor=story.agent)
    version = output_version(story, process)
    tick(story)
    tick(story)
    story.expect_rows(output_version(story, process) == version, not story.container.get(GrownOutputs).has_new_bytes(process.id))
    append(story, process.id, "...")
    tick(story)
    story.expect_text(f"output show {process.id}", "progress: 50", actor=story.agent)
    story.expect_rows(output_version(story, process) == version + 1)
    append(story, process.id, "F.\n")
    tick(story)
    story.expect_text(f"output show {process.id}", "progress: 70", "steps_passed: 6", "steps_failed: 1", "read_lines: 2", actor=story.agent)


def test_reader_line_numbers_match_the_output_after_many_partial_ticks(new_story):
    story, process = started_run(new_story, NUMBERED_READER)
    append(story, process.id, "collected 9 items\n.")
    for _ in range(3):
        tick(story)
    append(story, process.id, "F\nFAILED a\n..")
    tick(story)
    tick(story)
    append(story, process.id, "\nFAILED b\n")
    tick(story)
    story.expect_text(f"output show {process.id}", "read_lines: 5", actor=story.agent)
    story.expect_text(f"output read {process.id} --summary", "3: FAILED a", "5: FAILED b", actor=story.agent)


def test_a_tick_reads_only_the_bytes_that_arrived_since_the_last_one(new_story):
    story, process = started_run(new_story, BYTES_READER)
    append(story, process.id, "collected 2000 items\n" + BULK)
    sizes: list[int] = []
    original = OutputFolder.reader_bytes_after

    def measured(folder, process_id, position, offset):
        read = original(folder, process_id, position, offset)
        sizes.append(len(read))
        return read

    with patch.object(OutputFolder, "reader_bytes_after", autospec=True, side_effect=measured), \
            patch.object(OutputFolder, "reader_text", autospec=True, side_effect=AssertionError("a tick read the whole output")):
        tick(story)
        sizes.clear()
        append(story, process.id, "..\n")
        tick(story)
        story.expect_rows(sizes == [3])
        sizes.clear()
        append(story, process.id, ".")
        tick(story)
        story.expect_rows(sizes == [1])
        sizes.clear()
        append(story, process.id, "..")
        tick(story)
        story.expect_rows(sizes == [3])
