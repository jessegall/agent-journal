from engine.agent_machine.driver import Driver
from engine.enums.responder import Responder
from engine.enums.work_stop import WorkStop
from core.modules.drivers.drivers.main.main_agent_driver import MainAgentDriver
from suites.coding.drivers.coding_rank_orders import CODING_MAIN_RANK_ORDER


class CodingMainAgentDriver(Driver):
    """The coding suite's driver of the main agent: it gathers the core main driver's contributions and adds
    the suite's own, which its modules declare."""

    name = "coding.main"
    agent_type = "main"
    suite = "coding"
    gathers = [MainAgentDriver]
    rank_order = CODING_MAIN_RANK_ORDER
    work_stop = WorkStop.REFUSE_DURING_WORK
    responder = Responder.PERSON
    instructions = ["You are the main agent: what you may do is set by the work controls of this environment; read them with journal setting show"]
