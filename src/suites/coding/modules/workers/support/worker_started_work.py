from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.enums.task_state import TaskState
from suites.coding.modules.workers.commands.send_unfinished_tasks_line.send_unfinished_tasks_line import SendUnfinishedTasksLine
from suites.coding.modules.workers.support import worker_job
from suites.coding.modules.workers.support.worker_job import RESUMING_SOURCES, UNFINISHED_TASKS_SOURCE
from suites.coding.modules.workers.support.worker_stop import WorkerStop
from suites.coding.modules.workers.support.worker_unfinished_tasks import WorkerUnfinishedTasks
from suites.coding.support.coding_helper_kind import CodingHelperKind


class WorkerStartedWork:
    """The stopped workers that hold started work they can go on with and have no job waiting, which nothing else resumes: not
    one whose tests wait, not one a person or another agent stopped, and not one that was told to go on three times with no
    task moved since."""

    def __init__(self, queries: Queries, unfinished: WorkerUnfinishedTasks, stop: WorkerStop, bus: Bus) -> None:
        self.queries, self.unfinished, self.stop, self.bus = queries, unfinished, stop, bus

    def workers(self) -> list[Agent]:
        holders = sorted({task.holder_id for task in self.queries.query(Task).filter(state=TaskState.STARTED).all_rows() if task.holder_id is not None})
        return [worker for worker in self.queries.query(Agent).find_many(holders) if self.is_stranded(worker)]

    def is_stranded(self, worker: Agent) -> bool:
        if worker.role != CodingHelperKind.WORKER or worker.ended_at is None or worker.paused_at is not None or worker.retired_at is not None:
            return False
        if not self.unfinished.rows(worker.id):
            return False
        return not self.was_told_to_go_on(worker) and not self.stop.was_stopped(worker) and self.told_count(worker) < worker_job.RESUME_LIMIT_COUNT

    def was_told_to_go_on(self, worker: Agent) -> bool:
        """Whether a job waits for it, or one was handed to it since it stopped, so a start of its program is on its way."""
        lines = self.queries.query(AgentLine).filter(session_agent_id=worker.id).matching(Among("source", tuple(RESUMING_SOURCES))).all_rows()
        return any(line.state is AgentLineState.WAITING or line.update_timestamp().value > worker.ended_at.value for line in lines)

    def told_count(self, worker: Agent) -> int:
        lines = self.queries.query(AgentLine).filter(session_agent_id=worker.id, source=UNFINISHED_TASKS_SOURCE).all_rows()
        progress = self.unfinished.last_progress_text(worker.id)
        return sum(line.creation_timestamp().text >= progress for line in lines)

    def job(self, worker: Agent) -> AgentLine:
        return self.bus.run(SendUnfinishedTasksLine(worker.id), Actor.core(), environment_id=worker.environment_id)
