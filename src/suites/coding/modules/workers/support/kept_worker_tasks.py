from dataclasses import replace

from core.base.command.context import Context
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.support.nudger import Nudger
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.messages.support.work_sources import WorkSources
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.task_waits import TaskWaits
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worker_task_source import WorkerTaskSource
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_job import WORKER_JOB_SOURCE
from suites.coding.modules.workers.support.worker_proof_queue import WorkerProofQueue
from suites.coding.modules.workers.support.worker_task_advance import WorkerTaskAdvance
from suites.coding.modules.workers.support.worker_task_copies import WorkerTaskCopies
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class KeptWorkerTasks:
    """Hands new tasks to a kept worker. An open worktree takes them as its next tasks and what was delivered
    stays; a merged worker gets a new cut in its old folder on the same session; an unmerged branch is never
    overwritten."""

    def __init__(self, queries: Queries, repository: Repository, worktrees: WorktreeQuery, git: WorktreeGit, nudger: Nudger,
                 environments: EnvironmentRows, advance: WorkerTaskAdvance, sources: WorkSources, copies: WorkerTaskCopies, waits: TaskWaits,
                 proof_queue: WorkerProofQueue) -> None:
        self.queries, self.repository, self.worktrees, self.git, self.nudger = queries, repository, worktrees, git, nudger
        self.environments, self.advance, self.sources, self.copies, self.waits, self.proof_queue = environments, advance, sources, copies, waits, proof_queue

    def checked_cut(self, worker: Agent, task_ids: tuple[int, ...]) -> tuple[Task, ...]:
        tasks = tuple(self.queries.query(Task).find_many(list(task_ids)))
        if tasks[0].state is TaskState.BLOCKED and self.waits.has_only_task_waits(tasks[0].id):
            raise Refusal(f"task {tasks[0].id} waits on an open task", "send it when that one is done")
        for task in tasks:
            if task.state is not TaskState.OPEN and not (task.state is TaskState.BLOCKED and self.waits.has_only_task_waits(task.id)):
                raise Refusal(f"task {task.id} is {task.state.value}", "a worker takes an open task")
        worktree = self.worktrees.worker_worktree(worker.id)
        if worktree is not None:
            if self.proof_queue.tests_pending(worktree):
                raise Refusal(f"the tests of worker {worker.id} are running", "send the task when they have passed")
            return ()
        last = self.worktrees.newest_worktree(worker.id)
        if last is None:
            raise Refusal(f"worker {worker.id} has no worktree", "journal worker dispatch <task> starts a new one")
        if self.git.has_unmerged_branch(self.environments.find(worker.environment_id).folder, last):
            raise Refusal(f"worker {worker.id} has unmerged work on {last.branch}", f"journal worker merge {worker.id}, or merge the branch by hand")
        return tasks

    def handed(self, worker: Agent, worktree: Worktree, task_ids: tuple[int, ...], job: str, context: Context) -> AgentLine:
        tasks = self.queries.query(Task).find_many(list(task_ids))
        self.record_sources(worktree, tasks, replace(context, environment_id=worktree.environment_id))
        for task in tasks:
            if task.delegated_to != worker.id:
                self.repository.update(task, context, delegated_to=worker.id)
        if worktree.state is WorktreeState.DELIVERED:
            reworked = self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.rework), context)
            self.advance.start(reworked, tasks[0], context)
        first = tasks[0].id
        return self.nudger.send_text(worker.id, job or f"Task:{first} is yours next: journal task overview {first}", WORKER_JOB_SOURCE, context)

    def record_sources(self, worktree: Worktree, tasks: list[Task], context: Context) -> None:
        source = self.sources.source_copy(context)
        for assigned in self.copies.copies(tasks, source):
            self.repository.save(WorkerTaskSource(creator_id=context.actor.id, worktree_id=worktree.id, task_id=assigned.task_id, environment_id=worktree.environment_id,
                                                  source_message_id=assigned.source.message_id, source_version=assigned.source.version,
                                                  source_unavailable=assigned.source.unavailable), context)
