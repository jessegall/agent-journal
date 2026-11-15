from core.modules.drivers.drivers.rank_orders import WORKER_RANK_ORDER
from engine.agent_machine.driver import Driver
from engine.enums.responder import Responder
from engine.enums.work_stop import WorkStop
from suites.coding.support.context_line import CONTEXT_LINE


class MergerAgentDriver(Driver):
    """The coding suite's driver of the merger: an accepted merge with steps left refuses its stop, and its
    finished merge job is handed over; its modules declare its contributions."""

    name = "coding.merger"
    agent_type = "merger"
    suite = "coding"
    rank_order = WORKER_RANK_ORDER
    work_stop = WorkStop.MERGE_CONTRACT
    responder = Responder.PARENT
    instructions = [CONTEXT_LINE]
