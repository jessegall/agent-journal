from collections.abc import Sequence
from typing import ClassVar

from engine.agent_machine.contracts.line_source import LineSource
from engine.agent_machine.contracts.rank_order import RankOrder
from engine.enums.responder import Responder
from engine.enums.work_stop import WorkStop

DEPTH_LIMIT_FRAMES = 16


class Driver:
    """The driver of one agent type: whose declarations it gathers, the order of their rank keys, how its work
    answers a stop and who its escalations ask. It decides nothing by code of its own."""

    name: ClassVar[str]
    agent_type: ClassVar[str]
    suite: ClassVar[str] = "core"
    gathers: ClassVar[Sequence[type["Driver"]]] = ()
    rank_order: ClassVar[RankOrder]
    work_stop: ClassVar[WorkStop]
    responder: ClassVar[Responder] = Responder.PARENT
    opening_lines: ClassVar[Sequence[type[LineSource]]] = ()
    depth_limit: ClassVar[int] = DEPTH_LIMIT_FRAMES
