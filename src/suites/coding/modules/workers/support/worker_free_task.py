from dataclasses import replace

from engine.actor.actor import Actor
from core.modules.agents.models.agent import Agent
from engine.listener.rows.event_rows import EventRows
from engine.command.bus import Bus
from engine.command.context import Context
from core.modules.plans.support.next_plan_tasks import NextPlanTasks
from core.modules.tasks.commands.assign_task.assign_task import AssignTask
from core.modules.tasks.queries.task_query import TaskQuery

WORKER_MOST_COMPLEXITY = 3


class WorkerFreeTask:
    """Gives a worker with no open task of its own left the most urgent free task outside any plan that is
    simple enough for a worker. A worker that still has an open task assigned is given none, so a worker on a
    plan stays on its plan. A worker whose row has ended is given none: its program can still run and hand
    its work in, and no task may be assigned to an ended agent."""

    def __init__(self, tasks: TaskQuery, plan_tasks: NextPlanTasks, bus: Bus, rows: EventRows) -> None:
        self.tasks, self.plan_tasks, self.bus, self.rows = tasks, plan_tasks, bus, rows

    def give_next(self, worker_id: int, context: Context) -> None:
        if self.rows.required(Agent, worker_id).ended_at is not None or self.tasks.assigned(worker_id):
            return
        task = self.tasks.next_simple(WORKER_MOST_COMPLEXITY, self.plan_tasks.plan_exclusion())
        if task is not None:
            self.bus.dispatch(AssignTask(task.id, worker_id), replace(context, actor=Actor.core()))
