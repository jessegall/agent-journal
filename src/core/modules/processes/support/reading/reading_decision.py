from dataclasses import dataclass

from core.modules.processes.errors.decision_without_exit_error import DecisionWithoutExitError
from core.modules.processes.models.enums.pressure_level import PressureLevel
from core.modules.processes.models.enums.reader_action import ReaderAction
from core.modules.processes.models.enums.reader_state import ReaderState
from core.modules.processes.models.enums.reading_exit import ReadingExit
from core.modules.processes.models.enums.reason_code import ReasonCode


@dataclass(frozen=True)
class ReadingDecision:
    """What the engine decided for one part of a run at one point: the state, the action, how hard it presses,
    why, and the exits. A decision above a suggestion always has an exit the agent takes on its own."""

    state: ReaderState
    action: ReaderAction
    level: PressureLevel
    reason: ReasonCode
    exits: tuple[ReadingExit, ...]

    def __post_init__(self) -> None:
        if self.level > PressureLevel.SUGGEST and all(option.needs_other_party for option in self.exits):
            raise DecisionWithoutExitError.at_level(self.level)

    @classmethod
    def nothing(cls, state: ReaderState) -> "ReadingDecision":
        return cls(state, ReaderAction.NOTHING, PressureLevel.SUGGEST, ReasonCode.NONE, ())

    @classmethod
    def pressing(cls, state: ReaderState, action: ReaderAction, level: PressureLevel, reason: ReasonCode, exits: tuple[ReadingExit, ...]) -> "ReadingDecision":
        return cls(state, action, level, reason, exits)
