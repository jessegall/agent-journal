from dataclasses import replace

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.command.context import Context
from engine.driver.message_sender import MessageSender
from engine.query.queries import Queries
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.tasks.queries.task_query import TaskQuery
from core.modules.tasks.support.assignee_label import AssigneeLabel
from suites.coding.modules.workers.commands.send_worker.send_worker import SendWorker
from suites.coding.modules.workers.support.outside_waits import OutsideWaits
from suites.coding.modules.workers.support.worker_job import OUTSIDE_WAIT_SOURCE


class WorkerQueuedStart:
    """Once a worker's delivered work is merged, sends it every task still assigned to it as one new unit, so
    a worker never gets its tasks one merge at a time. A worker with nothing assigned stops and waits for the
    main agent's next batch; a worker left with only tasks that wait on a task nobody works on is named to the
    main agent with that task."""

    def __init__(self, tasks: TaskQuery, bus: Bus, queries: Queries, external_waits: OutsideWaits, labels: AssigneeLabel, message_sender: MessageSender) -> None:
        self.tasks, self.bus, self.queries, self.outside_waits, self.labels, self.message_sender = tasks, bus, queries, external_waits, labels, message_sender

    def start(self, worker_id: int, context: Context) -> None:
        queued_ids = tuple(task.id for task in self.tasks.assigned_ready(worker_id))
        if queued_ids:
            self.bus.run(SendWorker(worker_id, task_ids=queued_ids), context.actor, environment_id=context.environment_id)
        else:
            self.report_held(worker_id, context)

    def report_held(self, worker_id: int, context: Context) -> None:
        waiting = self.tasks.assigned_blocked(worker_id)
        blocker = self.outside_waits.blocker(waiting)
        main_agent = MainAgentFinder.latest(self.queries)
        if blocker is None or main_agent is None:
            return
        kept = ", ".join(f"task:{task.id}" for task in waiting)
        text = f"{self.labels.text(worker_id)} has only {kept}, and all wait on task:{blocker.id}, which no worker works on: {self.labels.task_label(blocker)} must do it"
        self.message_sender.send_text(main_agent.id, text, OUTSIDE_WAIT_SOURCE, replace(context, actor=Actor.core()))
