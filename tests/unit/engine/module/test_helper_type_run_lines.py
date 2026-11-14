from engine.helper_type.command_allow_list import CommandAllowList
from engine.helper_type.enums.journal_line_class import JournalLineClass
from engine.module.helper_type_check import HelperTypeCheck

NAME = "samples's helper type clerk"
LINES = {"clerk run": frozenset([JournalLineClass.BACKGROUND]), "task show": frozenset([JournalLineClass.READS])}


def problems(commands: CommandAllowList, journal_runs: tuple[str, ...]) -> list[str]:
    return list(HelperTypeCheck.run_problems(NAME, commands, journal_runs, LINES))


def test_a_list_that_misses_a_line_the_journal_runs_under_the_type_is_refused_naming_the_type_and_the_line():
    assert problems(CommandAllowList(lines=("task show",)), ("clerk run",)) == [f"{NAME} does not list the line clerk run, which the journal runs under it"]


def test_a_list_naming_the_line_or_its_group_or_its_class_passes():
    assert problems(CommandAllowList(lines=("clerk run",)), ("clerk run",)) == []
    assert problems(CommandAllowList(groups=("clerk",)), ("clerk run",)) == []
    assert problems(CommandAllowList(classes=(JournalLineClass.BACKGROUND,)), ("clerk run",)) == []


def test_a_line_no_module_serves_is_refused_as_a_typo():
    assert problems(CommandAllowList(lines=("clerk rnu",)), ("clerk rnu",)) == [f"{NAME} names the line clerk rnu the journal runs under it, which no module serves"]


def test_a_type_with_no_line_the_journal_runs_has_no_problem():
    assert problems(CommandAllowList(), ()) == []
