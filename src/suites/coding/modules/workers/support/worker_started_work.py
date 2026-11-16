from suites.coding.modules.workers.types.worker import Worker
from engine.query.conditions.is_null import IsNull
from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.query.conditions.among import Among
from engine.query.conditions.has_value import HasValue
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.commands.send_unfinished_tasks_line.send_unfinished_tasks_line import SendUnfinishedTasksLine
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.support.worker_job import RESUMING_SOURCES, UNFINISHED_TASKS_SOURCE
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance
from suites.coding.modules.workers.agent_messages.worker_unfinished_tasks_message import WorkerUnfinishedTasksMessage
from suites.coding.modules.workers.support.worker_settings import WORKER_RESUME_LIMIT
from suites.coding.modules.workers.support.worker_stop import WorkerStop
from suites.coding.modules.workers.support.worker_unfinished_tasks import WorkerUnfinishedTasks

STOPPED_WORKERS_REASON = "every stopped worker, and every line that resumed it, is counted to start it again"


class WorkerStartedWork:
    """The stopped workers that hold started work or an open assigned task they can go on with and have no
    job waiting, which nothing else resumes: not one whose tests wait or whose own run still goes (its end
    wakes it), not one a user or another agent stopped, and not one told to go on as often as the resume
    limit allows."""

    def __init__(self, queries: Queries, unfinished: WorkerUnfinishedTasks, stop: WorkerStop, bus: Bus, guidance: WorkerGuidance, settings: SettingValues, tasks: TaskQuery) -> None:
        self.guidance, self.settings, self.tasks = guidance, settings, tasks
        self.queries, self.unfinished, self.stop, self.bus = queries, unfinished, stop, bus

    def workers(self) -> list[Agent]:
        return [worker for worker in self.stopped_workers() if self.is_abandoned(worker)]

    def stopped_workers(self) -> list[Agent]:
        stopped = self.queries.query(Agent).filter(role=Worker.key).matching(HasValue("ended_at")).matching(IsNull("retired_at")).matching(IsNull("paused_at"))
        return list(stopped.every_row(STOPPED_WORKERS_REASON))

    def stopped_with_tasks(self) -> list[Agent]:
        return self.with_tasks(self.stopped_workers())

    def with_tasks(self, workers: list[Agent]) -> list[Agent]:
        return [worker for worker in workers if self.tasks.has_assigned_work(worker.id)]

    def is_abandoned(self, worker: Agent) -> bool:
        return bool(self.abandoned_tasks(worker))

    def abandoned_tasks(self, worker: Agent) -> tuple[Task, ...]:
        if worker.role != Worker.key or worker.ended_at is None or worker.paused_at is not None or worker.retired_at is not None:
            return ()
        worker_round = self.unfinished.steps.round(worker.id)
        if worker_round.is_asking or self.has_waiting_job(worker) or self.unfinished.has_worker_running_process(worker.id) or self.stop.was_stopped(worker) or self.reached_restart_limit(worker):
            return ()
        return self.unfinished.round_rows(worker_round)

    def reached_restart_limit(self, worker: Agent) -> bool:
        with self.bus.scopes.row_scope(worker):
            return self.resume_count(worker) >= self.settings.number(WORKER_RESUME_LIMIT)

    def has_waiting_job(self, worker: Agent) -> bool:
        return self.queries.query(AgentLine).filter(session_agent_id=worker.id, state=AgentLineState.WAITING).matching(Among("source", tuple(RESUMING_SOURCES))).exists()

    def resume_count(self, worker: Agent) -> int:
        lines = self.queries.query(AgentLine).filter(session_agent_id=worker.id, source=UNFINISHED_TASKS_SOURCE).every_row(STOPPED_WORKERS_REASON)
        progress = self.unfinished.last_progress_text(worker.id)
        return sum(line.creation_timestamp().text >= progress for line in lines)

    def job(self, worker: Agent, tasks: tuple[Task, ...]) -> AgentLine:
        line = WorkerUnfinishedTasksMessage.declared().agent_message(tasks=self.unfinished.names(tasks), line=self.guidance.line(worker.id))
        return self.bus.run(SendUnfinishedTasksLine(worker.id, line, UNFINISHED_TASKS_SOURCE), Actor.core(), environment_id=worker.environment_id)
