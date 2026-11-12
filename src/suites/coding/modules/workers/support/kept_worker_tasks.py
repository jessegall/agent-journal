from core.modules.assignments.support.assignments import Assignments
from dataclasses import replace

from engine.command.context import Context
from engine.database.kept_rows import KeptRows
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from engine.scope.scopes import Scopes
from core.modules.agents.models.agent import Agent
from engine.model.model import Model
from engine.driver.nudger import Nudger
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.messages.support.work_sources import WorkSources
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.dependency_waits import DependencyWaits
from suites.coding.modules.workers.support.assignable_tasks import AssignableTasks
from suites.coding.modules.workers.support.main_reserved_tasks import MainReservedTasks
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worker_task_source import WorkerTaskSource
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_job import WAITING_TASKS_SOURCE, WORKER_JOB_SOURCE
from suites.coding.modules.workers.support.worker_proof_queue import WorkerProofQueue
from suites.coding.modules.workers.support.worker_task_copies import WorkerTaskCopies
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.support.worker_assignments import WorkerAssignments
from core.modules.agents.support.agent_label import AgentLabel


class KeptWorkerTasks:
    """Hands new tasks to a kept worker. An open worktree takes them as its next tasks; a delivered one keeps
    its delivery mergeable, the tasks wait and start once it is merged; a merged worker gets a new cut in
    its old folder on the same session; an unmerged branch is never overwritten."""

    def __init__(self, queries: Queries, repository: Repository, worktrees: WorktreeQuery, git: WorktreeGit, nudger: Nudger,
                 environments: EnvironmentRows, sources: WorkSources, copies: WorkerTaskCopies,
                 proof_queue: WorkerProofQueue, scopes: Scopes, kept: KeptRows, dependency_waits: DependencyWaits, assignments: WorkerAssignments, reservations: MainReservedTasks, task_assignments: Assignments) -> None:
        self.task_assignments = task_assignments
        self.queries, self.repository, self.worktrees, self.git, self.nudger = queries, repository, worktrees, git, nudger
        self.environments, self.sources, self.copies, self.proof_queue = environments, sources, copies, proof_queue
        self.scopes = scopes
        self.kept = kept
        self.dependency_waits = dependency_waits
        self.assignments, self.reservations = assignments, reservations

    def read_tasks(self, task_ids: tuple[int, ...]) -> list[Task]:
        return self.kept.scoped_current(lambda: self.queries.query(Task).find_many(task_ids),
                                        name=f"workers.sent_tasks:{task_ids}")

    def check_tasks(self, task_ids: tuple[int, ...], sender_id: int | None = None) -> list[Task]:
        self.reservations.check(task_ids)
        return AssignableTasks.checked(self.read_tasks(task_ids), sender_id)

    def checked_cut(self, worker: Agent, task_ids: tuple[int, ...], read: list[Task] | None = None) -> list[Task]:
        tasks = self.check_tasks(task_ids) if read is None else AssignableTasks.checked(read)
        worktree = self.worktrees.worker_worktree(worker.id)
        if worktree is not None:
            if self.proof_queue.tests_pending(worktree):
                raise Refusal(f"the tests of {AgentLabel.from_agent(worker).text} are running", "send the task when they have passed")
            return []
        self.check_recut(worker)
        if not AssignableTasks.has_open(tasks):
            return []
        return tasks

    def check_recut(self, worker: Agent) -> None:
        last = self.worktrees.newest_worktree(worker.id)
        if last is None:
            raise Refusal(f"{AgentLabel.from_agent(worker).text} has no worktree", "journal worker dispatch <task> starts a new one")
        if self.git.has_unmerged_branch(self.environments.find(worker.environment_id).folder, last):
            raise Refusal(f"{AgentLabel.from_agent(worker).text} has unmerged work on {last.branch}", f"journal worker merge {worker.number}, or merge the branch by hand")

    def handed(self, worker: Agent, worktree: Worktree, task_ids: tuple[int, ...], job: str, context: Context) -> Model:
        tasks = AssignableTasks.open_first(self.read_tasks(task_ids))
        if worktree.state is WorktreeState.DELIVERED:
            return self.queued_after_delivery(worker, tasks, job, context)
        self.record_sources(worktree, tasks, replace(context, environment_id=worktree.environment_id))
        self.delegate(worker, tasks, context)
        if AssignableTasks.all_blocked(tasks):
            waiting = ", ".join(f"task:{task.id}" for task in tasks)
            return self.nudger.send_text(worker.id, job or f"{waiting} are yours once they open; go on with what you have", WAITING_TASKS_SOURCE, context)
        first = tasks[0].id
        return self.nudger.send_text(worker.id, job or f"Task:{first} is yours next: journal task overview {first}", WORKER_JOB_SOURCE, context)

    def queued_after_delivery(self, worker: Agent, tasks: list[Task], job: str, context: Context) -> Model:
        self.delegate(worker, tasks, context)
        queued = ", ".join(f"task:{task.id}" for task in tasks)
        return self.nudger.send_text(worker.id, job or f"{queued} are yours once your delivered work is merged: stay as you are until then", WAITING_TASKS_SOURCE, context)

    def waiting(self, worker: Agent, task_ids: tuple[int, ...], context: Context) -> Model:
        tasks = self.read_tasks(task_ids)
        self.delegate(worker, tasks, context)
        waiting = ", ".join(f"task:{task.id}" for task in tasks)
        return self.nudger.send_text(worker.id, f"{waiting} are yours once they open", WAITING_TASKS_SOURCE, context)

    def delegate(self, worker: Agent, tasks: list[Task], context: Context) -> None:
        actor_ids = self.task_assignments.row_actor_ids(Task, [task.id for task in tasks])
        changed = [task for task in tasks if actor_ids[task.id] != tuple([worker.id])]
        for task in changed:
            self.task_assignments.assign(task, worker.id, context, cascade=False)
        self.dependency_waits.update_tasks([task.id for task in tasks], context)
        if changed:
            self.assignments.record(worker.id, changed, context)

    def record_sources(self, worktree: Worktree, tasks: list[Task], context: Context) -> None:
        with self.scopes.row_scope(worktree):
            source = self.sources.source_copy(context)
            for assigned in self.copies.copies(tasks, source):
                self.repository.save(WorkerTaskSource(creator_id=context.actor.id, worktree_id=worktree.id, task_id=assigned.task_id,
                                                      source_message_id=assigned.source.message_id, source_version=assigned.source.version,
                                                      source_unavailable=assigned.source.unavailable), context)
