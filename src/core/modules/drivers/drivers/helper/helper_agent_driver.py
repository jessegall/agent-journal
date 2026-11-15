from engine.agent_machine.contracts.rank_order import RankOrder
from engine.agent_machine.driver import Driver
from engine.enums.responder import Responder
from engine.enums.work_stop import WorkStop


class HelperAgentDriver(Driver):
    """The core driver of a read-only helper: its stop on its own job hands the job over to its parent, who
    answers its escalations. Its rank order holds the keys its modules' contributions name; none are
    declared yet."""

    name = "core.helper"
    agent_type = "helper"
    suite = "core"
    rank_order = RankOrder((), ())
    work_stop = WorkStop.HANDOVER
    responder = Responder.PARENT
