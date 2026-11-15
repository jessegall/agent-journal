from core.modules.drivers.drivers.rank_orders import MAIN_RANK_ORDER
from engine.agent_machine.driver import Driver
from engine.enums.responder import Responder
from engine.enums.work_stop import WorkStop


class MainAgentDriver(Driver):
    """The core driver of a main agent: its work refuses a stop while work remains and a person answers its
    escalations. It gathers no other driver and its rank order holds the keys its modules' contributions
    name; none are declared yet."""

    name = "core.main"
    agent_type = "main"
    suite = "core"
    rank_order = MAIN_RANK_ORDER
    work_stop = WorkStop.REFUSE_WHILE_WORK_REMAINS
    responder = Responder.PERSON
