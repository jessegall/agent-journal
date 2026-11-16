from dataclasses import replace

from engine.actor.actor import Actor
from core.modules.agents.models.agent import Agent
from engine.listener.rows.event_rows import EventRows
from engine.command.bus import Bus
from engine.command.context import Context
from core.modules.plans.support.next_plan_tasks import NextPlanTasks
from core.modules.tasks.commands.assign_task.assign_task import AssignTask
from core.modules.tasks.models.enums.task_state import TaskState
from engine.query.conditions.among import Among
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.support.worker_places import WorkerPlaces

WORKER_MOST_COMPLEXITY = 3


class WorkerFreeTask:
    """Gives a worker with no unfinished task of its own left the most urgent free task outside any plan that
    is simple enough for a worker. A worker that still has a task assigned, holds a started one or waits on
    the tests of one from an earlier commit is given none, so a worker on a plan stays on its plan; the tasks
    handed in when the task is given are its finished work, not work it still has. It is given only once the
    work is handed in, so it never joins the unit that work belongs to. A worker whose row has ended is given
    none: its program can still run and hand its work in, and no task may be assigned to an ended agent. While
    more workers run than the running limit allows, a worker that finishes is given none, so lowering the
    limit lets the running workers end what they hold and stop."""

    def __init__(self, tasks: TaskQuery, plan_tasks: NextPlanTasks, bus: Bus, rows: EventRows, places: WorkerPlaces) -> None:
        self.tasks, self.plan_tasks, self.bus, self.rows, self.places = tasks, plan_tasks, bus, rows, places

    def give_next(self, worker_id: int, handed_in_ids: tuple[int, ...], context: Context) -> None:
        if self.rows.required(Agent, worker_id).ended_at is not None or self.has_work(worker_id, set(handed_in_ids)):
            return
        if len(self.places.running()) > self.places.run_limit():
            return
        task = self.tasks.next_simple(WORKER_MOST_COMPLEXITY, self.plan_tasks.plan_exclusion())
        if task is not None:
            self.bus.dispatch(AssignTask(task.id, worker_id), replace(context, actor=Actor.core()))

    # as worker status counts it: a task assigned and unfinished, a task it holds started, or one waiting for tests,
    # leaving out the tasks just committed
    def has_work(self, worker_id: int, committed_ids: set[int]) -> bool:
        unfinished = [task for task in self.tasks.unfinished_assigned(worker_id) if task.id not in committed_ids]
        testing = self.tasks.assignee_tasks(worker_id).filter(state=TaskState.TESTING).matching(Among("id", tuple(committed_ids), negated=True)).first()
        return bool(unfinished) or self.tasks.holder_started(worker_id).first() is not None or testing is not None
