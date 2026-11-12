from engine.model.lifecycle import Lifecycle
from engine.model.move import Move
from core.modules.processes.models.enums.process_state import ProcessState

OPEN = (ProcessState.RUNNING, ProcessState.BACKGROUND)


class ProcessLifecycle(Lifecycle):
    states = ProcessState
    initial = [ProcessState.RUNNING, ProcessState.FINISHED, ProcessState.FAILED]
    editable = OPEN
    deletable = tuple(state for state in ProcessState if state not in OPEN)

    background = Move("background", [ProcessState.RUNNING], ProcessState.BACKGROUND)
    finish = Move("finish", OPEN, ProcessState.FINISHED)
    fail = Move("fail", OPEN, ProcessState.FAILED)
    stop = Move("stop", OPEN, ProcessState.STOPPED)
    orphan = Move("orphan", OPEN, ProcessState.ORPHANED)
