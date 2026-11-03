from dataclasses import replace

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.repository.repository import Repository
from core.modules.drivers.support.nudger import Nudger
from core.modules.tasks.commands.start_task.start_task import StartTask
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worker_job import WORKER_JOB_SOURCE
from suites.coding.modules.workers.support.worker_nudges import WORKER_NEXT_TASK, WORKER_TASK_AFTER_REASSIGNED, WORKER_TASK_REASSIGNED


class WorkerTaskAdvance:
    """Starts a worker's next task on its worktree and tells the worker which one it is and how to read it."""

    def __init__(self, bus: Bus, repository: Repository, nudger: Nudger) -> None:
        self.bus, self.repository, self.nudger = bus, repository, nudger

    def next_task(self, worktree: Worktree, following: Task, context: Context) -> None:
        self.start(worktree, following, context)
        self.nudger.send(worktree.agent_id, WORKER_NEXT_TASK, WORKER_JOB_SOURCE, context, task=following.id)

    def after_reassigned_task(self, worktree: Worktree, reassigned: Task, following: Task, context: Context) -> None:
        self.start(worktree, following, context)
        self.nudger.send(worktree.agent_id, WORKER_TASK_REASSIGNED, WORKER_JOB_SOURCE, context, task=reassigned.id)
        self.nudger.send(worktree.agent_id, WORKER_TASK_AFTER_REASSIGNED, WORKER_JOB_SOURCE, context, task=following.id)

    def start(self, worktree: Worktree, following: Task, context: Context) -> None:
        self.bus.dispatch(StartTask(following.id), replace(context, actor=Actor(worktree.agent_id, ActorType.AGENT)))
        self.repository.save(worktree.moved(WorktreeLifecycle.advance, task_id=following.id), context)
