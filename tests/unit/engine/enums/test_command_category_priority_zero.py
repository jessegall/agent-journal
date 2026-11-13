from engine.enums.command_category import CommandCategory
from engine.enums.process_type import ProcessType


def test_reading_writing_and_searching_are_priority_zero_and_they_and_journal_commands_never_go_to_the_background():
    zero = [category for category in CommandCategory if category.is_priority_zero]
    foreground = [category for category in CommandCategory if not category.is_backgroundable]
    assert (zero, foreground) == ([CommandCategory.SEARCH, CommandCategory.READ, CommandCategory.EDIT], [CommandCategory.SEARCH, CommandCategory.READ, CommandCategory.EDIT, CommandCategory.JOURNAL])


def test_a_hook_is_priority_zero_by_its_kind_and_a_test_run_is_not():
    assert (ProcessType.HOOK.is_priority_zero, ProcessType.HOOK.is_backgroundable, CommandCategory.TEST_RUN.is_priority_zero, ProcessType.SHELL.takes_place) == (True, False, False, True)
