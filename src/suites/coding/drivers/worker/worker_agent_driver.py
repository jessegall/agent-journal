from engine.agent_machine.contracts.rank_order import RankOrder
from engine.agent_machine.driver import Driver
from engine.enums.responder import Responder
from engine.enums.work_stop import WorkStop


class WorkerAgentDriver(Driver):
    """The coding suite's driver of a worker: its unit refuses a stop while work remains and its parent
    answers its escalations; no contributions are declared yet."""

    name = "coding.worker"
    agent_type = "worker"
    suite = "coding"
    rank_order = RankOrder((), ())
    work_stop = WorkStop.REFUSE_WHILE_WORK_REMAINS
    responder = Responder.PARENT
