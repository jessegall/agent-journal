from collections.abc import Sequence
from dataclasses import dataclass

from engine.agent_stack.reason import Reason
from engine.agent_machine.needs.rank_order import RankOrder
from engine.agent_machine.decision import Decision
from engine.enums.decision_class import DecisionClass


@dataclass(frozen=True)
class Judgement:
    """The decision a step's reasons add up to: the highest class present, the reason shown picked inside that
    class by the driver's rank order and then the order the reasons were found in, every other reason kept."""

    decision: Decision
    outranked_reasons: tuple[Reason, ...]

    @classmethod
    def combined(cls, reasons: Sequence[Reason], rank_order: RankOrder) -> "Judgement":
        if not reasons:
            return cls(Decision.allowed(), ())
        ordered = [reason for _, reason in sorted(enumerate(reasons), key=lambda pair: (-pair[1].decision_class, rank_order.place(pair[1].rank), pair[0]))]
        return cls(Decision(DecisionClass(ordered[0].decision_class), ordered[0]), tuple(ordered[1:]))
