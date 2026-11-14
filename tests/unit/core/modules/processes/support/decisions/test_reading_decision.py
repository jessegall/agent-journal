import pytest

from core.modules.processes.errors.exitless_decision_error import ExitlessDecisionError
from core.modules.processes.models.enums.pressure_level import PressureLevel
from core.modules.processes.models.enums.reader_action import ReaderAction
from core.modules.processes.models.enums.reader_state import ReaderState
from core.modules.processes.models.enums.reading_exit import ReadingExit
from core.modules.processes.models.enums.reason_code import ReasonCode
from core.modules.processes.support.decisions.reading_decision import ReadingDecision

PRESSING_LEVELS = [level for level in PressureLevel if level > PressureLevel.SUGGEST]
DIFFERENT_PARTY_EXITS = (ReadingExit.PERSON_RELEASES, ReadingExit.MAIN_AGENT_HELPS, ReadingExit.EXPIRES)


def pressing(level: PressureLevel, exits: tuple[ReadingExit, ...]) -> ReadingDecision:
    return ReadingDecision.pressing(ReaderState.MISSING, ReaderAction.REQUIRE, level, ReasonCode.READER_MISSING, exits)


def test_every_level_above_a_suggestion_is_one_of_three():
    assert PRESSING_LEVELS == [PressureLevel.PREVENT, PressureLevel.BLOCK, PressureLevel.FREEZE]


@pytest.mark.parametrize("level", PRESSING_LEVELS)
def test_a_decision_above_a_suggestion_with_exits_only_others_take_cannot_be_built(level):
    with pytest.raises(ExitlessDecisionError):
        pressing(level, DIFFERENT_PARTY_EXITS)
    with pytest.raises(ExitlessDecisionError):
        pressing(level, ())


@pytest.mark.parametrize("level", PRESSING_LEVELS)
def test_a_decision_above_a_suggestion_with_comply_is_built(level):
    assert pressing(level, (ReadingExit.COMPLY, ReadingExit.EXPIRES)).level is level


def test_a_suggestion_needs_no_exit():
    assert pressing(PressureLevel.SUGGEST, ()).exits == ()


@pytest.mark.parametrize("exit_option", list(ReadingExit))
def test_only_a_person_the_main_agent_and_the_expiry_are_other_parties(exit_option):
    assert exit_option.needs_other_party is (exit_option in DIFFERENT_PARTY_EXITS)


def test_nothing_builds_a_decision_that_asks_nothing():
    decision = ReadingDecision.empty(ReaderState.SUITABLE)
    assert (decision.state, decision.action, decision.level, decision.reason, decision.exits) == (
        ReaderState.SUITABLE, ReaderAction.IGNORE, PressureLevel.SUGGEST, ReasonCode.NONE, ())
