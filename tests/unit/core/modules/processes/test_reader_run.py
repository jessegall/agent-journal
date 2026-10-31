import stat

from core.base.driver.command_category import CommandCategory
from core.modules.processes.models.enums.reader_type import ReaderType
from core.modules.processes.models.process import Process
from core.modules.processes.models.reader import Reader
from core.modules.processes.support.reader_run import ReaderRun
from core.modules.processes.support.reader_selection import ReaderSelection


def reader(identifier: int = 1, **fields: object) -> Reader:
    return Reader(**{"id": identifier, "version": 1, "creator_id": 1, "name": f"reader{identifier}", "type": ReaderType.PATTERN, "commands": "pytest*", **fields})


def process(line: str = "pytest -q", category: CommandCategory = CommandCategory.TEST_RUN) -> Process:
    return Process(id=1, version=1, environment_id=1, agent_id=2, creator_id=2, line=line, folder="/work", shell="sh", category=category, limit_seconds=30)


def script(tmp_path, body: str) -> str:
    path = tmp_path / "read.sh"
    path.write_text(f"#!/bin/sh\n{body}\n")
    path.chmod(path.stat().st_mode | stat.S_IXUSR)
    return str(path)


def test_the_default_reader_of_the_matching_ones_reads_a_line_and_else_the_newest():
    readers = [reader(1), reader(2, is_default=True), reader(3, commands="make*", is_default=True)]
    assert ReaderSelection.of(readers, process()).id == 2
    assert ReaderSelection.of(readers[:1] + readers[2:], process()).id == 1
    assert ReaderSelection.of([reader(1), reader(4)], process()).id == 4
    assert ReaderSelection.of([reader(1, commands="make*,pytest*")], process()).id == 1
    assert ReaderSelection.of(readers, process("ls")) is None


def test_a_journal_commands_own_output_is_read_by_no_reader():
    assert ReaderSelection.of([reader(1, commands="*")], process("journal task show 1", CommandCategory.JOURNAL)) is None


def test_a_pattern_picks_the_matching_lines_with_their_numbers():
    picked = ReaderRun().lines(reader(lines_pattern="FAILED|error"), "ok\nFAILED a\nfine\nerror b\n", "finished")
    assert picked == ["2: FAILED a", "4: error b"]


def test_the_summary_is_the_last_match_with_its_groups_joined_or_the_whole_match():
    text = "1 passed in 0.1s\n2 failed, 1 passed in 0.4s\n"
    assert ReaderRun().summary(reader(summary_pattern="([0-9]+ failed), ([0-9]+ passed)"), text) == "2 failed 1 passed"
    assert ReaderRun().summary(reader(summary_pattern="[0-9]+ passed.*"), text) == "1 passed in 0.4s"
    assert ReaderRun().summary(reader(), text) == ""


def test_a_script_gets_the_output_on_its_input_and_the_stage_of_the_run(tmp_path):
    path = script(tmp_path, 'echo "stage $JOURNAL_OUTPUT_STAGE"; grep -c . | sed "s/^/lines /"')
    assert ReaderRun().lines(reader(type=ReaderType.SCRIPT, script=path), "a\nb\n", "failed") == ["stage failed", "lines 2"]


def test_a_script_past_the_time_limit_is_cut_off_and_says_so(tmp_path):
    path = script(tmp_path, "sleep 5")
    assert ReaderRun(limit_seconds=0.2).lines(reader(type=ReaderType.SCRIPT, script=path), "a\n", "running") == ["reader reader1 did not finish within 0.2 seconds"]


def test_a_script_that_is_not_there_says_so():
    assert "could not run" in ReaderRun().lines(reader(type=ReaderType.SCRIPT, script="/nowhere/read.sh"), "a\n", "running")[0]
