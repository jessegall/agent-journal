from collections.abc import Sequence

from core.base.driver.command_category import CommandCategory
from core.base.driver.command_effect import CommandEffect
from core.base.driver.shell_line import ShellLine
from core.base.driver.tool import Tool
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart

LISTING = ShellPart("cat", CommandCategory.READ, ["notes"])
SEARCHING = ShellPart("grep", CommandCategory.SEARCH, ["cart"])
TESTING = ShellPart("pytest", CommandCategory.TEST_RUN, ["-q"])
BUILDING = ShellPart("make", CommandCategory.BUILD, [])
EDITING = ShellPart("sed", CommandCategory.EDIT, ["-i"], effects=[CommandEffect.WRITES_FILES])


def line_of(text: str, *parts: ShellPart, redirects: Sequence[str] = ()) -> ShellLine:
    return ShellLine.parsed(HookSamples.shell(text, *parts, redirects=redirects).body["tool"]["shell"])


def test_a_chain_tests_when_any_of_its_parts_tests_whichever_comes_first():
    assert line_of("cat notes && pytest -q", LISTING, TESTING).has_test_run_part
    assert line_of("pytest -q && cat notes", TESTING, LISTING).has_test_run_part
    assert not line_of("cat notes && grep cart", LISTING, SEARCHING).has_test_run_part


def test_a_chain_builds_or_writes_when_any_of_its_parts_does():
    assert line_of("cat notes && make", LISTING, BUILDING).has_build_part
    assert line_of("cat notes && sed -i", LISTING, EDITING).has_part_writing_files
    assert not line_of("cat notes && grep cart", LISTING, SEARCHING).has_part_writing_files


def test_a_redirect_makes_a_chain_write():
    assert line_of("cat notes", LISTING, redirects=["> copy.txt"]).has_part_writing_files


def test_a_chain_only_reads_when_all_of_its_parts_read_and_none_writes():
    assert line_of("cat notes && grep cart", LISTING, SEARCHING).writes_nothing
    assert not line_of("cat notes && pytest -q", LISTING, TESTING).writes_nothing
    assert not line_of("cat notes", LISTING, redirects=["> copy.txt"]).writes_nothing
    assert line_of("cat notes", LISTING, redirects=["2>&1"]).writes_nothing
    assert line_of("cat notes", LISTING, redirects=["2>/dev/null"]).writes_nothing
    assert line_of("cat notes", LISTING, redirects=["< input.txt"]).writes_nothing


def test_a_process_of_a_mixed_chain_takes_the_category_of_the_part_a_reader_watches():
    assert line_of("cat notes && pytest -q", LISTING, TESTING).watched_part_category is CommandCategory.TEST_RUN
    assert line_of("cat notes && grep cart", LISTING, SEARCHING).watched_part_category is CommandCategory.READ
