from collections.abc import Sequence
from typing import ClassVar

from engine.agent_machine.contracts.line_source import LineSource
from engine.agent_machine.needs.rank_order import RankOrder
from engine.enums.responder import Responder
from engine.enums.work_stop import WorkStop

DEPTH_LIMIT_FRAMES = 16
CORE_SUITE = "core"


class Driver:
    """The driver of one agent type: whose declarations it gathers, the order of their rank keys, how its work
    answers a stop, who its escalations ask and the instruction lines its agent starts with. It decides nothing by
    code of its own."""

    name: ClassVar[str]
    agent_type: ClassVar[str]
    suite: ClassVar[str] = CORE_SUITE
    gathers: ClassVar[Sequence[type["Driver"]]] = ()
    rank_order: ClassVar[RankOrder]
    work_stop: ClassVar[WorkStop]
    responder: ClassVar[Responder] = Responder.PARENT
    opening_lines: ClassVar[Sequence[type[LineSource]]] = ()
    instructions: ClassVar[Sequence[str]] = ()
    depth_limit: ClassVar[int] = DEPTH_LIMIT_FRAMES
