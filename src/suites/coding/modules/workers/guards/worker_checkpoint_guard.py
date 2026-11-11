from core.modules.agents.models.agent import Agent
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from engine.command.context import Context
from engine.errors.refusal import Refusal
from engine.event.moved import Moved
from engine.guard.guard import Guard
from engine.listener.event_rows import EventRows
from suites.coding.models.enums.ask_topic import AskTopic
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from suites.coding.modules.workers.support.unpassed_checkpoints import UnpassedCheckpoints
from suites.coding.modules.workers.support.worker_task_access import WORKER_TASKS_HINT


class WorkerCheckpointGuard(Guard[Moved[Task]]):
    """Refuses a worker the start of a task whose phase comes after a checkpoint phase of its plan that has not
    passed, unless the worker's unit holds every open task of that checkpoint's window. The phases up to that
    checkpoint are free: their order is a suggestion."""

    name = "workers.task-after-checkpoint"
    moves = tuple([TaskLifecycle.start])

    def __init__(self, rows: EventRows, checkpoints: UnpassedCheckpoints) -> None:
        self.rows, self.checkpoints = rows, checkpoints

    def check(self, event: Moved[Task], context: Context) -> None:
        agent = self.rows.find(Agent, context.actor.id)
        if agent is None or agent.role != CodingHelperRole.WORKER:
            return
        place = self.checkpoints.blocking_places([event.row.id], agent.id).get(event.row.id)
        if place is not None:
            raise Refusal(f"task {event.row.id} comes after checkpoint phase {place.phase_id}, which has not passed", AskTopic.GENERAL.hint(WORKER_TASKS_HINT))
