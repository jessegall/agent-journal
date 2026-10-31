from core.base.model.lifecycle import Lifecycle
from core.base.model.move import Move
from core.modules.tasks.models.enums.task_state import TaskState


class TaskLifecycle(Lifecycle):
    states = TaskState
    initial = [TaskState.OPEN]
    editable = (TaskState.OPEN, TaskState.STARTED, TaskState.BLOCKED, TaskState.TESTING)
    deletable = (TaskState.OPEN, TaskState.CANCELLED)

    start = Move("start", [TaskState.OPEN], TaskState.STARTED)
    block = Move("block", (TaskState.OPEN, TaskState.STARTED), TaskState.BLOCKED)
    unblock = Move("unblock", [TaskState.BLOCKED], TaskState.OPEN)
    test = Move("test", [TaskState.STARTED], TaskState.TESTING)
    retest = Move("retest", [TaskState.TESTING], TaskState.STARTED)
    close = Move("close", (TaskState.STARTED, TaskState.TESTING), TaskState.COMPLETED)
    cancel = Move("cancel", (TaskState.OPEN, TaskState.STARTED, TaskState.BLOCKED, TaskState.TESTING), TaskState.CANCELLED)
    reopen = Move("reopen", (TaskState.COMPLETED, TaskState.CANCELLED), TaskState.OPEN)
