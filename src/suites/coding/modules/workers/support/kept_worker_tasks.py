from dataclasses import replace

from core.base.command.context import Context
from core.base.database.kept_rows import KeptRows
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.base.scope.scopes import Scopes
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.support.nudger import Nudger
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.messages.support.work_sources import WorkSources
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.dependency_waits import DependencyWaits
from suites.coding.modules.workers.support.assignable_tasks import AssignableTasks
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worker_task_source import WorkerTaskSource
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_job import WAITING_TASKS_SOURCE, WORKER_JOB_SOURCE
from suites.coding.modules.workers.support.worker_proof_queue import WorkerProofQueue
from suites.coding.modules.workers.support.worker_task_advance import WorkerTaskAdvance
from suites.coding.modules.workers.support.worker_task_copies import WorkerTaskCopies
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class KeptWorkerTasks:
    """Hands new tasks to a kept worker. An open worktree takes them as its next tasks and what was delivered
    stays; a merged worker gets a new cut in its old folder on the same session; an unmerged branch is never
    overwritten."""

    def __init__(self, queries: Queries, repository: Repository, worktrees: WorktreeQuery, git: WorktreeGit, nudger: Nudger,
                 environments: EnvironmentRows, advance: WorkerTaskAdvance, sources: WorkSources, copies: WorkerTaskCopies,
                 proof_queue: WorkerProofQueue, scopes: Scopes, kept: KeptRows, dependency_waits: DependencyWaits) -> None:
        self.queries, self.repository, self.worktrees, self.git, self.nudger = queries, repository, worktrees, git, nudger
        self.environments, self.advance, self.sources, self.copies, self.proof_queue = environments, advance, sources, copies, proof_queue
        self.scopes = scopes
        self.kept = kept
        self.dependency_waits = dependency_waits

    def read_tasks(self, task_ids: tuple[int, ...]) -> list[Task]:
        return self.kept.scoped_current(lambda: self.queries.query(Task).find_many(task_ids),
                                        name=f"workers.sent_tasks:{task_ids}")

    def check_tasks(self, task_ids: tuple[int, ...]) -> list[Task]:
        return AssignableTasks.checked(self.read_tasks(task_ids))

    def checked_cut(self, worker: Agent, task_ids: tuple[int, ...]) -> list[Task]:
        tasks = self.check_tasks(task_ids)
        worktree = self.worktrees.worker_worktree(worker.id)
        if worktree is not None:
            if self.proof_queue.tests_pending(worktree):
                raise Refusal(f"the tests of worker {worker.id} are running", "send the task when they have passed")
            return []
        self.check_recut(worker)
        if not AssignableTasks.has_open(tasks):
            return []
        return tasks

    def check_recut(self, worker: Agent) -> None:
        last = self.worktrees.newest_worktree(worker.id)
        if last is None:
            raise Refusal(f"worker {worker.id} has no worktree", "journal worker dispatch <task> starts a new one")
        if self.git.has_unmerged_branch(self.environments.find(worker.environment_id).folder, last):
            raise Refusal(f"worker {worker.id} has unmerged work on {last.branch}", f"journal worker merge {worker.id}, or merge the branch by hand")

    def handed(self, worker: Agent, worktree: Worktree, task_ids: tuple[int, ...], job: str, context: Context) -> AgentLine:
        tasks = AssignableTasks.open_first(self.read_tasks(task_ids))
        self.record_sources(worktree, tasks, replace(context, environment_id=worktree.environment_id))
        self.delegate(worker, tasks, context)
        if not AssignableTasks.has_open(tasks):
            waiting = ", ".join(f"task:{task.id}" for task in tasks)
            return self.nudger.send_text(worker.id, job or f"{waiting} are yours once they open; go on with what you have", WAITING_TASKS_SOURCE, context)
        if worktree.state is WorktreeState.DELIVERED:
            reworked = self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.rework), context)
            self.advance.start(reworked, tasks[0], context)
        first = tasks[0].id
        return self.nudger.send_text(worker.id, job or f"Task:{first} is yours next: journal task overview {first}", WORKER_JOB_SOURCE, context)

    def waiting(self, worker: Agent, task_ids: tuple[int, ...], context: Context) -> AgentLine:
        tasks = self.read_tasks(task_ids)
        self.delegate(worker, tasks, context)
        waiting = ", ".join(f"task:{task.id}" for task in tasks)
        return self.nudger.send_text(worker.id, f"{waiting} are yours once they open", WAITING_TASKS_SOURCE, context)

    def delegate(self, worker: Agent, tasks: list[Task], context: Context) -> None:
        for task in tasks:
            if task.delegated_to != worker.id:
                self.repository.update(task, context, delegated_to=worker.id)
        self.dependency_waits.update_tasks([task.id for task in tasks], context)

    def record_sources(self, worktree: Worktree, tasks: list[Task], context: Context) -> None:
        with self.scopes.row_scope(worktree):
            source = self.sources.source_copy(context)
            for assigned in self.copies.copies(tasks, source):
                self.repository.save(WorkerTaskSource(creator_id=context.actor.id, worktree_id=worktree.id, task_id=assigned.task_id,
                                                      source_message_id=assigned.source.message_id, source_version=assigned.source.version,
                                                      source_unavailable=assigned.source.unavailable), context)
