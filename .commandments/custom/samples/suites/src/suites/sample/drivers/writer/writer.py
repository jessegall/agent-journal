from engine.agent_machine.driver import Driver
from engine.enums.responder import Responder
from engine.enums.work_stop import WorkStop


# @righteous architecture_layout_suite_driver_outside_its_folder
class WriterDriver(Driver):
    name = "sample.writer"
    agent_type = "worker"
    suite = "sample"
    rank_order = ()
    work_stop = WorkStop.REFUSE_DURING_WORK
    responder = Responder.PARENT
