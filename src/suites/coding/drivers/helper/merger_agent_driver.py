from engine.agent_machine.contracts.rank_order import RankOrder
from engine.agent_machine.driver import Driver
from engine.enums.responder import Responder
from engine.enums.work_stop import WorkStop


class MergerAgentDriver(Driver):
    """The coding suite's driver of the merger: an accepted merge with steps left refuses its stop, and its
    finished merge job is handed over; no contributions are declared yet."""

    name = "coding.merger"
    agent_type = "merger"
    suite = "coding"
    rank_order = RankOrder((), ())
    work_stop = WorkStop.MERGE_CONTRACT
    responder = Responder.PARENT
