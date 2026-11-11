from engine.query.conditions.among import Among
from engine.query.conditions.minimum import Minimum
from engine.query.queries import Queries
from core.modules.plans.models.plan_task import PlanTask
from core.modules.tasks.models.enums.task_state import UNFINISHED_STATES
from core.modules.tasks.models.open_dependency import OpenDependency
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TASK_PAGE_ROWS
from suites.coding.modules.workers.support.phase_work import PhaseWork
from core.modules.plans.support.task_plans import TaskPlans
from core.modules.processes.queries.process_query import ProcessQuery
from suites.coding.modules.workers.models.worker_refusal_count import WorkerRefusalCount
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worker_ask_facts import WorkerAskFacts
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance
from suites.coding.modules.workers.support.worker_point import WorkerPoint
from suites.coding.modules.workers.support.worktree_git import WorktreeGit

OUTPUT_COUNT = 3


class WorkerAskFactsQuery:
    """Reads the facts of a worker that asks the merger something."""

    def __init__(self, guidance: WorkerGuidance, processes: ProcessQuery, queries: Queries, git: WorktreeGit, plans: TaskPlans) -> None:
        self.guidance, self.processes, self.queries, self.git, self.plans = guidance, processes, queries, git, plans

    def read(self, point: WorkerPoint, task: Task) -> WorkerAskFacts:
        worker_round = point.round
        outputs = tuple(f"output {process.id}, {process.state}: {process.line}" for process in self.processes.agent(worker_round.worker_id).newest().limited(OUTPUT_COUNT))
        worktree = worker_round.worktree
        if worktree is None:
            return WorkerAskFacts(point.step.value, task.id, None, outputs, (), self.phase_work(task.id))
        return WorkerAskFacts(point.step.value, task.id, self.last_refusal(worktree), outputs, tuple(sorted(self.git.worker_files(worktree))), self.phase_work(task.id))

    def phase_work(self, task_id: int) -> PhaseWork | None:
        phase = self.plans.find_phase(task_id)
        if phase is None:
            return None
        unfinished = self.queries.query(PlanTask).filter(plan_id=phase.plan_id).matching(Minimum("phase_position", phase.position)).matching(Among("state", UNFINISHED_STATES))
        places = tuple(unfinished.ordered("task_id").all_rows(TASK_PAGE_ROWS))
        blockers: dict[int, list[int]] = {place.task_id: [] for place in places}
        for dependency in self.queries.query(OpenDependency).matching(Among("task_id", list(blockers))).ordered("id").all_rows(TASK_PAGE_ROWS):
            blockers[dependency.task_id].append(dependency.dependency_id)
        return PhaseWork(phase.title, phase.test_command if phase.checkpoint and phase.test_command else None,
                         tuple(self.task_line(place, blockers[place.task_id]) for place in places))

    @staticmethod
    def task_line(place: PlanTask, blocker_ids: list[int]) -> str:
        waits = ", ".join(f"task {blocker_id}" for blocker_id in blocker_ids) if blocker_ids else "nothing"
        return f"task {place.task_id} ({place.state.value}) waits on {waits}"

    def last_refusal(self, worktree: Worktree) -> str | None:
        counted = self.queries.query(WorkerRefusalCount).filter(worktree_id=worktree.id).first()
        return None if counted is None else counted.refusal_text
