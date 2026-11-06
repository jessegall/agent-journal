import shlex
import stat
import subprocess

import pytest

from core.base.driver.command_category import CommandCategory
from core.modules.processes.models.enums.reader_type import ReaderType
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader import Reader
from core.modules.processes.support.reader_run import ReaderRun
from core.modules.processes.support.reader_selection import ReaderSelection
from core.modules.processes.support.stock_reader import STOCK_READERS


def reader(identifier: int = 1, **fields: object) -> Reader:
    return Reader(**{"id": identifier, "version": 1, "creator_id": 1, "name": f"reader{identifier}", "type": ReaderType.PATTERN, "commands": "pytest*", **fields})


def part(text: str = "pytest -q", category: CommandCategory = CommandCategory.TEST_RUN, position: int = 1) -> ProcessPart:
    return ProcessPart(id=position, version=1, process_id=1, position=position, text=text, program=text.split()[0], category=category)


def script(tmp_path, body: str) -> str:
    path = tmp_path / "read.sh"
    path.write_text(f"#!/bin/sh\n{body}\n")
    path.chmod(path.stat().st_mode | stat.S_IXUSR)
    return str(path)


def test_the_default_reader_of_the_matching_ones_reads_a_line_and_else_the_newest():
    readers = [reader(1), reader(2, is_default=True), reader(3, commands="make*", is_default=True)]
    assert ReaderSelection.choose(readers, [part()]).reader.id == 2
    assert ReaderSelection.choose(readers[:1] + readers[2:], [part()]).reader.id == 1
    assert ReaderSelection.choose([reader(1), reader(4)], [part()]).reader.id == 4
    assert ReaderSelection.choose([reader(1, commands="make*,pytest*")], [part()]).reader.id == 1
    assert ReaderSelection.choose(readers, [part("ls", CommandCategory.PROCESS)]) is None


@pytest.mark.parametrize("line", ["CI=1 pytest -q", "CI=1 FOO='a b' pytest -q", 'PATH="/x y" pytest -q'])
def test_a_reader_matches_a_command_behind_the_variables_a_line_sets(line):
    assert ReaderSelection.choose([reader(1)], [part(line)]).reader.id == 1


def test_a_journal_commands_own_output_is_read_by_no_reader():
    assert ReaderSelection.choose([reader(1, commands="*")], [part("journal task show 1", CommandCategory.JOURNAL)]) is None


def test_a_search_that_names_a_command_is_read_by_no_reader():
    assert ReaderSelection.choose([reader(1, commands="*vitest*")], [part("grep -n vitest notes", CommandCategory.SEARCH)]) is None


def test_a_chain_is_read_by_the_reader_of_its_test_run_whatever_stands_before_it():
    parts = [part("grep -n word notes", CommandCategory.SEARCH), part("pytest -q -n 4", CommandCategory.TEST_RUN, 2)]
    part_reader = ReaderSelection.choose([reader(1, commands="grep*"), reader(2)], parts)
    assert (part_reader.reader.id, part_reader.part.position) == (2, 2)


def test_a_pattern_picks_the_matching_lines_with_their_numbers():
    selected_lines = ReaderRun().lines(reader(lines_pattern="FAILED|error"), "ok\nFAILED a\nfine\nerror b\n", "finished")
    assert selected_lines == ["2: FAILED a", "4: error b"]


def test_a_count_uses_the_last_number_group_and_keeps_the_count_without_a_match():
    counted = reader(count_pattern=r"collected ([0-9]+) items|([0-9]+) tests collected")
    assert ReaderRun().count(counted, "collected 12 items\n7 tests collected\n", 3) == 7
    assert ReaderRun().count(counted, "running\n", 7) == 7


def test_a_count_without_groups_adds_matching_lines():
    counted = reader(count_pattern=r"^\S+\.(?:test|spec)\.\w+ > ")
    assert ReaderRun().count(counted, "a.test.js > first\nnoise\na.spec.ts > second\n", 3) == 5


def test_stock_patterns_match_real_pytest_collection_and_vitest_listing_output():
    pytest_reader, vitest_reader = STOCK_READERS[:2]
    assert ReaderRun().count(reader(count_pattern=pytest_reader.count), "11 tests collected in 0.01s\n", 0) == 11
    names = [
        "tests/dockFold.test.js > scrolling down to the foot opens the docked cards, and scrolling up away from it folds them",
        "tests/dockFold.test.js > a scroll that goes down but stays away from the foot, or up within the last few pixels, changes nothing",
        "tests/dockFold.test.js > a card folded by hand keeps that, else it follows the scroll",
    ]
    listing = "printf '%s\\n' " + " ".join(shlex.quote(name) for name in names) + " run --reporter=dot"
    listed = subprocess.run(["sh", "-c", vitest_reader.count_command.replace("{part}", listing)], capture_output=True, text=True, check=True).stdout
    assert ReaderRun().count(reader(count_pattern=vitest_reader.count), listed, 0) == 3
    assert ReaderRun().count(reader(count_pattern=vitest_reader.count), " Test Files  1 passed (1)\n      Tests  1 failed | 2 passed (3)\n", 0) == 3


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
