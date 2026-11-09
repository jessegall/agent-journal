from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.query.conditions.among import Among
from core.base.query.conditions.has_value import HasValue
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.enums.task_state import TaskState
from suites.coding.modules.workers.commands.send_unfinished_tasks_line.send_unfinished_tasks_line import SendUnfinishedTasksLine
from suites.coding.modules.workers.support import worker_job
from suites.coding.modules.workers.support.worker_job import RESUMING_SOURCES, UNFINISHED_TASKS_SOURCE
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance
from suites.coding.modules.workers.support.worker_stop import WorkerStop
from suites.coding.modules.workers.support.worker_unfinished_tasks import WorkerUnfinishedTasks
from suites.coding.support.coding_helper_role import CodingHelperRole


class WorkerStartedWork:
    """The stopped workers that hold started work or an open assigned task they can go on with and have no job
    waiting, which nothing else resumes: not one whose tests wait, not one a person or another agent stopped,
    and not one that was told to go on three times with no task moved since."""

    def __init__(self, queries: Queries, unfinished: WorkerUnfinishedTasks, stop: WorkerStop, bus: Bus, guidance: WorkerGuidance) -> None:
        self.guidance = guidance
        self.queries, self.unfinished, self.stop, self.bus = queries, unfinished, stop, bus

    def workers(self) -> list[Agent]:
        holders = {task.holder_id for task in self.queries.query(Task).filter(state=TaskState.STARTED).all_rows() if task.holder_id is not None}
        assigned = {task.delegated_to for task in self.queries.query(Task).filter(state=TaskState.OPEN).matching(HasValue("delegated_to")).all_rows()}
        return [worker for worker in self.queries.query(Agent).find_many(sorted(holders | assigned)) if self.is_abandoned(worker)]

    def is_abandoned(self, worker: Agent) -> bool:
        if worker.role != CodingHelperRole.WORKER or worker.ended_at is None or worker.paused_at is not None or worker.retired_at is not None:
            return False
        worker_round = self.unfinished.steps.round(worker.id)
        if worker_round.is_asking or not self.unfinished.round_rows(worker_round):
            return False
        return not self.has_waiting_job(worker) and not self.stop.was_stopped(worker) and self.resume_count(worker) < worker_job.RESUME_LIMIT_COUNT

    def has_waiting_job(self, worker: Agent) -> bool:
        return self.queries.query(AgentLine).filter(session_agent_id=worker.id, state=AgentLineState.WAITING).matching(Among("source", tuple(RESUMING_SOURCES))).exists()

    def resume_count(self, worker: Agent) -> int:
        lines = self.queries.query(AgentLine).filter(session_agent_id=worker.id, source=UNFINISHED_TASKS_SOURCE).all_rows()
        progress = self.unfinished.last_progress_text(worker.id)
        return sum(line.creation_timestamp().text >= progress for line in lines)

    def job(self, worker: Agent) -> AgentLine:
        return self.bus.run(SendUnfinishedTasksLine(worker.id, self.guidance.line(worker.id)), Actor.core(), environment_id=worker.environment_id)
