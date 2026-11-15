from core.modules.drivers.commands.record_hook_call.record_hook_call_handler import CONTEXT_LIMIT_MARGIN
from core.modules.drivers.commands.support.context_line_split import ContextLineSplit
from engine.driver.nudge_declaration import BARE_TEMPLATE, NudgeDeclaration
from engine.enums.nudge_type import NudgeType

LINE = NudgeDeclaration("sample.line", NudgeType.NOTICE, BARE_TEMPLATE, full_text=True)
LIMIT = 10_000 - CONTEXT_LIMIT_MARGIN


def lines(count: int, size: int):
    return [LINE.nudge(text=f"{number:04d}" + "x" * (size - 4)) for number in range(count)]


def test_lines_over_9500_characters_are_split_across_two_replies():
    split = ContextLineSplit.split(lines(30, 500), LIMIT)
    assert LIMIT == 9500 and split.kept and split.rest
    assert sum(len(nudge.text) for nudge in split.kept) + len(split.kept) - 1 <= LIMIT


def test_no_line_is_cut_in_the_middle():
    split = ContextLineSplit.split(lines(30, 500), LIMIT)
    assert all(len(nudge.text) == 500 for nudge in (*split.kept, *split.rest))


def test_every_line_is_delivered_once_over_the_replies():
    given = lines(30, 500)
    split = ContextLineSplit.split(given, LIMIT)
    assert [nudge.text for nudge in (*split.kept, *split.rest)] == [nudge.text for nudge in given]


def test_a_single_line_over_the_limit_is_cut_at_the_limit():
    split = ContextLineSplit.split([*lines(1, 12_000), *lines(1, 10)], LIMIT)
    assert [len(nudge.text) for nudge in split.kept] == [LIMIT] and len(split.rest) == 1


def test_a_program_with_no_limit_is_never_split():
    given = lines(30, 500)
    assert ContextLineSplit.split(given, 0) == ContextLineSplit(tuple(given), ())
