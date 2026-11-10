from collections.abc import Sequence

from engine.driver.classification import Classification
from engine.driver.command_category import CommandCategory
from engine.driver.command_effect import CommandEffect
from engine.driver.part import Part
from engine.driver.shell_line import ShellLine
from engine.driver.tool import Tool
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.support.story_checks import expect_value

LISTING = ShellPart("cat", CommandCategory.READ, ["notes"])
SEARCHING = ShellPart("grep", CommandCategory.SEARCH, ["cart"])
TESTING = ShellPart("pytest", CommandCategory.TEST_RUN, ["-q"])
BUILDING = ShellPart("make", CommandCategory.BUILD, [])
EDITING = ShellPart("sed", CommandCategory.EDIT, ["-i"], effects=[CommandEffect.WRITES_FILES])


def read_line(text: str, *parts: ShellPart, redirects: Sequence[str] = ()) -> ShellLine:
    return ShellLine.parsed(HookSamples.shell(text, *parts, redirects=redirects).body["tool"]["shell"])


def expect_full_test_run(parts: tuple[Part, ...], is_full: bool) -> None:
    assert ShellLine("", parts, (), False, "").has_full_test_run is is_full


def test_a_line_that_skips_the_saved_commands_is_no_full_test_run():
    skip = Part('journal alias skip --reason "one run"', "journal", "", ("alias", "skip"), Classification(CommandCategory.JOURNAL, ()), (), (), "&&", None)
    suite = Part("pytest", "pytest", "", (), Classification(CommandCategory.TEST_RUN, ()), (), (), "", None, is_full_test_run=True)
    expect_full_test_run(tuple([suite]), True)
    expect_full_test_run((skip, suite), False)


def test_a_chain_tests_when_any_of_its_parts_tests_whichever_comes_first():
    expect_test_part("cat notes && pytest -q", LISTING, TESTING)
    expect_test_part("pytest -q && cat notes", TESTING, LISTING)
    expect_absent_test_part("cat notes && grep cart", LISTING, SEARCHING)


def test_a_chain_builds_or_writes_when_any_of_its_parts_does():
    expect_build_part("cat notes && make", LISTING, BUILDING)
    expect_part_writing_files_2("cat notes && sed -i", LISTING, EDITING)
    expect_absent_part_writing_files("cat notes && grep cart", LISTING, SEARCHING)


def test_a_redirect_makes_a_chain_write():
    expect_part_writing_files("cat notes", LISTING, "> copy.txt")


def test_a_chain_only_reads_when_all_of_its_parts_read_and_none_writes():
    expect_readonly_2("cat notes && grep cart", LISTING, SEARCHING)
    expect_absent_readonly_2("cat notes && pytest -q", LISTING, TESTING)
    expect_absent_readonly("cat notes", LISTING, "> copy.txt")
    expect_readonly("cat notes", LISTING, "2>&1")
    expect_readonly("cat notes", LISTING, "2>/dev/null")
    expect_readonly("cat notes", LISTING, "< input.txt")


def test_a_process_of_a_mixed_chain_takes_the_category_of_the_part_a_reader_watches():
    expect_watched_part_category("cat notes && pytest -q", LISTING, TESTING, CommandCategory.TEST_RUN)
    expect_watched_part_category("cat notes && grep cart", LISTING, SEARCHING, CommandCategory.READ)


def expect_watched_part_category(text, item, item_2, expected) -> None:
    actual = read_line(text, item, item_2).watched_part_category
    assert actual is expected, actual


def expect_readonly(text, item, text_2) -> None:
    actual = read_line(text, item, redirects=[text_2]).is_readonly
    assert actual, actual


def expect_absent_readonly(text, item, text_2) -> None:
    actual = read_line(text, item, redirects=[text_2]).is_readonly
    assert not actual, actual


def expect_absent_readonly_2(text, item, item_2) -> None:
    actual = read_line(text, item, item_2).is_readonly
    assert not actual, actual


def expect_readonly_2(text, item, item_2) -> None:
    actual = read_line(text, item, item_2).is_readonly
    assert actual, actual


def expect_part_writing_files(text, item, text_2) -> None:
    actual = read_line(text, item, redirects=[text_2]).has_part_writing_files
    assert actual, actual


def expect_absent_part_writing_files(text, item, item_2) -> None:
    actual = read_line(text, item, item_2).has_part_writing_files
    assert not actual, actual


def expect_part_writing_files_2(text, item, item_2) -> None:
    actual = read_line(text, item, item_2).has_part_writing_files
    assert actual, actual


def expect_build_part(text, item, item_2) -> None:
    actual = read_line(text, item, item_2).has_build_part
    assert actual, actual


def expect_absent_test_part(text, item, item_2) -> None:
    actual = read_line(text, item, item_2).has_test_run_part
    assert not actual, actual


def expect_test_part(text, item, item_2) -> None:
    actual = read_line(text, item, item_2).has_test_run_part
    assert actual, actual


def expect_uncertainty(line: ShellLine, uncertain: bool, old_hook: bool) -> None:
    assert (line.has_uncertain_part, line.has_old_hook_part) == (uncertain, old_hook)


def test_a_part_the_hook_could_not_judge_reaches_the_shell_line():
    expect_uncertainty(read_line("""awk 'BEGIN { system("rm a") }' notes""", ShellPart("awk", CommandCategory.READ, ["notes"], uncertain=True)), True, False)


def test_a_line_of_plain_reads_has_no_uncertain_part():
    expect_uncertainty(read_line("cat notes", LISTING), False, False)


def test_an_old_hook_sends_no_doubt_so_its_parts_count_as_uncertain_and_the_line_says_why():
    shell = HookSamples.shell("cat notes", LISTING).body["tool"]["shell"]
    del shell["parts"][0]["classification"]["uncertain"]
    expect_uncertainty(ShellLine.parsed(shell), True, True)


def test_a_line_naming_the_same_task_twice_names_it_once():
    block = ShellPart("journal", CommandCategory.JOURNAL, ["task", "block", "12", "--reason", "waits"])
    second = ShellPart("journal", CommandCategory.JOURNAL, ["task", "close", "9"])
    line = read_line("journal task block 12 --reason waits && journal task block 12 --reason waits && journal task close 9", block, block, second)
    expect_value(line.journal_command_numbers("task block", "task close"), (12, 9))
