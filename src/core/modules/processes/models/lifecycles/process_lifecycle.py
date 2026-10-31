from core.base.model.lifecycle import Lifecycle
from core.base.model.move import Move
from core.modules.processes.models.enums.process_state import ProcessState

OPEN = (ProcessState.RUNNING, ProcessState.BACKGROUND)


class ProcessLifecycle(Lifecycle):
    states = ProcessState
    initial = [ProcessState.RUNNING]
    editable = OPEN
    deletable = tuple(ProcessState)

    background = Move("background", [ProcessState.RUNNING], ProcessState.BACKGROUND)
    finish = Move("finish", OPEN, ProcessState.FINISHED)
    fail = Move("fail", OPEN, ProcessState.FAILED)
    stop = Move("stop", OPEN, ProcessState.STOPPED)
    orphan = Move("orphan", OPEN, ProcessState.ORPHANED)
