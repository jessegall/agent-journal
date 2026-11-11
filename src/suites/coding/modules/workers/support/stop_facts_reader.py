from engine.query.conditions.minimum import Minimum
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.support.stop_facts import StopFacts
from suites.coding.modules.workers.support.worker_handoff import WorkerHandoff
from suites.coding.modules.workers.support.worker_job import UNFINISHED_TASKS_SOURCE
from suites.coding.modules.workers.support.worker_launch_failures import WorkerLaunchFailures
from suites.coding.modules.workers.support.worker_resume import WorkerResume
from suites.coding.modules.workers.support.worker_settings import WORKER_RESUME_LIMIT
from suites.coding.modules.workers.support.worker_stop import WorkerStop
from suites.coding.modules.workers.support.worker_unfinished_tasks import WorkerUnfinishedTasks


class StopFactsReader:
    """Reads the facts of a worker that ended a turn with tasks left, for the one reading of its stop. It
    answers nothing for a worker with no task left."""

    def __init__(self, queries: Queries, unfinished: WorkerUnfinishedTasks, stop: WorkerStop, resume: WorkerResume, handoff: WorkerHandoff, launches: WorkerLaunchFailures, settings: SettingValues) -> None:
        self.settings = settings
        self.queries, self.unfinished, self.stop, self.resume, self.handoff, self.launches = queries, unfinished, stop, resume, handoff, launches

    def read(self, worker: Agent, actor_id: int) -> StopFacts | None:
        worker_round = self.unfinished.steps.round(worker.id)
        tasks = self.unfinished.round_rows(worker_round)
        if not tasks:
            return None
        is_busy = self.resume.compaction.is_running(worker.id) or self.unfinished.has_running_process(worker.id) or self.handoff.is_pending(worker)
        progress = Minimum("created_at", self.unfinished.last_progress_text(worker.id))
        resume_count = self.queries.query(AgentLine).filter(session_agent_id=worker.id, source=UNFINISHED_TASKS_SOURCE).matching(progress).count()
        return StopFacts(is_busy=is_busy, is_person_stop=self.stop.is_final(worker, actor_id), has_launch_failed=self.launches.has_failed(worker),
                         is_delegated=any(task.delegated_to == worker.id for task in tasks), is_resume_limit_reached=resume_count >= self.settings.number(WORKER_RESUME_LIMIT),
                         has_requested_help=worker_round.is_asking, is_program_ready=self.resume.program_state(worker).is_ready)
