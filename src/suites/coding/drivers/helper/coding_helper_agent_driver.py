from core.modules.drivers.drivers.helper.helper_agent_driver import HelperAgentDriver
from engine.agent_machine.driver import Driver
from engine.enums.responder import Responder
from engine.enums.work_stop import WorkStop
from suites.coding.support.context_line import CONTEXT_LINE


class CodingHelperAgentDriver(Driver):
    """The coding suite's driver of a read-only helper: it gathers the core helper driver's contributions, hands
    its finished job over to its parent, who answers its escalations, and starts it with the context line."""

    name = "coding.helper"
    agent_type = "helper"
    suite = "coding"
    gathers = [HelperAgentDriver]
    rank_order = HelperAgentDriver.rank_order
    work_stop = WorkStop.JOB_REPORT
    responder = Responder.PARENT
    instructions = [CONTEXT_LINE]
