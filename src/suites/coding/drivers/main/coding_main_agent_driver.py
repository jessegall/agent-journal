from engine.agent_machine.driver import Driver
from engine.enums.responder import Responder
from engine.enums.work_stop import WorkStop
from core.modules.drivers.drivers.main.main_agent_driver import MainAgentDriver


class CodingMainAgentDriver(Driver):
    """The coding suite's driver of the main agent: it gathers the core main driver's contributions and adds
    the suite's own; none are declared yet."""

    name = "coding.main"
    agent_type = "main"
    suite = "coding"
    gathers = [MainAgentDriver]
    rank_order = MainAgentDriver.rank_order
    work_stop = WorkStop.REFUSE_WHILE_WORK_REMAINS
    responder = Responder.PERSON
