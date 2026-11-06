from dataclasses import replace

from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.support.nudger import Nudger
from core.modules.environments.models.environment import Environment
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.messages.support.work_sources import WorkSources
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.cancel_worker_opening.cancel_worker_opening import CancelWorkerOpening
from suites.coding.modules.workers.commands.open_kept_worktree.open_kept_worktree import OpenKeptWorktree
from suites.coding.modules.workers.commands.prepare_worktree.prepare_worktree import PrepareWorktree
from suites.coding.modules.workers.commands.record_worktree_cut.record_worktree_cut import RecordWorktreeCut
from suites.coding.modules.workers.commands.send_worker.send_worker import SendWorker
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worker_task_source import WorkerTaskSource
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_job import WORKER_JOB_SOURCE
from suites.coding.modules.workers.support.worker_task_advance import WorkerTaskAdvance
from suites.coding.modules.workers.support.worker_task_copies import WorkerTaskCopies
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class KeptWorkerTasks:
    """Hands new tasks to a kept worker. An open worktree takes them as its next tasks and what was delivered
    stays; a merged worker gets a new cut in its old folder on the same session; an unmerged branch is never
    overwritten."""

    def __init__(self, queries: Queries, repository: Repository, worktrees: WorktreeQuery, git: WorktreeGit, bus: Bus, nudger: Nudger,
                 environments: EnvironmentRows, advance: WorkerTaskAdvance, sources: WorkSources, copies: WorkerTaskCopies) -> None:
        self.queries, self.repository, self.worktrees, self.git, self.bus, self.nudger = queries, repository, worktrees, git, bus, nudger
        self.environments, self.advance, self.sources, self.copies = environments, advance, sources, copies

    def tasks(self, command: SendWorker) -> list[Task]:
        tasks = self.queries.query(Task).find_many(list(command.task_ids))
        for task in tasks:
            if task.state is not TaskState.OPEN:
                raise Refusal(f"task {task.id} is {task.state.value}", "a worker takes an open task")
        return tasks

    def prepare(self, worker: Agent, command: SendWorker, actor: Actor) -> None:
        tasks = self.tasks(command)
        if self.worktrees.worker_worktree(worker.id) is not None:
            return
        last = self.worktrees.newest_worktree(worker.id)
        if last is None:
            raise Refusal(f"worker {worker.id} has no worktree", "journal worker dispatch <task> starts a new one")
        environment = self.environments.find(worker.environment_id)
        if self.git.has_unmerged_branch(environment.folder, last):
            raise Refusal(f"worker {worker.id} has unmerged work on {last.branch}", f"journal worker merge {worker.id}, or merge the branch by hand")
        self.cut(worker, tasks, command, actor, environment)

    def cut(self, worker: Agent, tasks: list[Task], command: SendWorker, actor: Actor, environment: Environment) -> None:
        opened = self.bus.run(OpenKeptWorktree(worker.id, tasks[0].id), actor, environment_id=worker.environment_id)
        try:
            base_commit = self.git.tip(environment.folder, environment.branch)
            self.git.cut(environment.folder, opened)
            self.bus.run(PrepareWorktree(opened.folder, environment.folder, environment.name, command.library_links, command.library_copies), actor,
                         environment_id=worker.environment_id)
            self.bus.run(RecordWorktreeCut(opened.id, base_commit, tuple(task.id for task in tasks)), actor, environment_id=worker.environment_id)
        except Exception:
            self.git.remove(environment.folder, opened)
            self.bus.run(CancelWorkerOpening(opened.id), actor, environment_id=worker.environment_id)
            raise

    def handed(self, worker: Agent, worktree: Worktree, command: SendWorker, context: Context) -> AgentLine:
        tasks = self.queries.query(Task).find_many(list(command.task_ids))
        self.record_sources(worktree, tasks, replace(context, environment_id=worktree.environment_id))
        for task in tasks:
            if task.delegated_to != worker.id:
                self.repository.update(task, context, delegated_to=worker.id)
        if worktree.state is WorktreeState.DELIVERED:
            reworked = self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.rework), context)
            self.advance.start(reworked, tasks[0], context)
        first = tasks[0].id
        return self.nudger.send_text(worker.id, command.job or f"Task:{first} is yours next: journal task overview {first}", WORKER_JOB_SOURCE, context)

    def record_sources(self, worktree: Worktree, tasks: list[Task], context: Context) -> None:
        source = self.sources.source_copy(context)
        for assigned in self.copies.copies(tasks, source):
            self.repository.save(WorkerTaskSource(creator_id=context.actor.id, worktree_id=worktree.id, task_id=assigned.task_id, environment_id=worktree.environment_id,
                                                  source_message_id=assigned.source.message_id, source_version=assigned.source.version,
                                                  source_unavailable=assigned.source.unavailable), context)
