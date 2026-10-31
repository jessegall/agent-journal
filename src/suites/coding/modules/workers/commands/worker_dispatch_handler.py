from dataclasses import replace
from pathlib import Path
from uuid import uuid4

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.agents.agent import Agent
from core.modules.agents.agent_role import AgentRole
from core.modules.agents.agent_start import AgentStart
from core.modules.environments.environment import Environment
from core.modules.tasks.task import Task
from core.modules.tasks.task_start import TaskStart
from suites.coding.modules.workers.commands.worker_dispatch import WorkerDispatch
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.worktree_git import WorktreeGit

WORKER_PROGRAM = "claude"
WORKTREES_FOLDER = Path(".journal") / "worktrees"


class WorkerDispatchHandler(Handler[WorkerDispatch, Agent]):
    """Makes the worker's agent row and its worktree row, cuts the worktree from the environment's branch and starts
    the task with the worker as its holder; a failed cut removes what git made, and the rows roll back."""

    command = WorkerDispatch

    def __init__(self, queries: Queries, repository: Repository, bus: Bus, git: WorktreeGit) -> None:
        self.queries, self.repository, self.bus, self.git = queries, repository, bus, git

    def handle(self, command: WorkerDispatch, context: Context) -> Agent:
        task = self.queries.query(Task).find(command.task_id)
        environment = self.queries.query(Environment).find(task.environment_id)
        worker_context = replace(context, environment_id=environment.id)
        start = AgentStart(str(uuid4()), self.program(context.actor), AgentRole.WORKER, context.actor.id)
        worker = self.bus.dispatch(start, worker_context)
        name = f"worker-{worker.id}"
        worktree = self.repository.save(Worktree(agent_id=worker.id, environment_id=environment.id, task_id=task.id, creator_id=context.actor.id,
                                                 folder=str(Path(environment.folder) / WORKTREES_FOLDER / environment.name / name),
                                                 branch=f"journal/{environment.name}/{name}", base_branch=environment.branch), worker_context)
        base_commit = self.git.tip(environment.folder, environment.branch)
        try:
            self.git.cut(environment.folder, worktree)
            self.repository.save(worktree.cut(context.timestamp, context.actor, base_commit), worker_context)
            self.bus.dispatch(TaskStart(task.id), replace(worker_context, actor=Actor(worker.id, ActorType.AGENT)))
        except Refusal:
            self.git.remove(environment.folder, worktree)
            raise
        return worker

    def program(self, actor: Actor) -> str:
        caller = self.queries.query(Agent).filter(id=actor.id).page(1, 1).rows
        return caller[0].program if caller else WORKER_PROGRAM
