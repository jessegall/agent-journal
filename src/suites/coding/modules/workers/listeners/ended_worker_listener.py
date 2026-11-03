from core.base.actor_type import ActorType
from core.base.agent_role import AgentRole
from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.support.nudger import Nudger
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from core.modules.waits.models.enums.wait_state import WaitState
from core.modules.waits.models.enums.wait_type import WaitType
from core.modules.waits.models.wait import Wait
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_job import UNFINISHED_TASKS_SOURCE
from suites.coding.modules.workers.support.worker_nudges import WORKER_ENDED_WITH_TASKS, WORKER_UNFINISHED_TASKS

SOURCE = "workers.ended-worker"
RESUME_LIMIT_COUNT = 3


class EndedWorkerListener(SaveListener):
    """A worker that ends with delegated tasks unfinished is told to carry on, which resumes it, so its main
    agent hears nothing before its last delivery; one that ended while its tests wait gets its next task from
    them. A worker a person ended holds no delegated task or is ended by that person; that one, one that reported
    being stuck and one that keeps ending leave its main agent one line naming all its tasks."""

    name = "workers.ended-worker"
    event = "agent.update"

    def __init__(self, tasks: TaskQuery, nudger: Nudger, queries: Queries, worktrees: WorktreeQuery, proofs: ProofQuery) -> None:
        self.tasks, self.nudger, self.queries, self.worktrees, self.proofs = tasks, nudger, queries, worktrees, proofs

    def handle(self, change: Change[Model]) -> None:
        old, new = change.old_row, change.new_row
        if not isinstance(old, Agent) or not isinstance(new, Agent) or old.ended_at is not None or new.ended_at is None:
            return
        if new.role != AgentRole.WORKER or new.parent_id is None:
            return
        started = tuple(self.tasks.holder(new.id).started().all_rows())
        queued = self.tasks.next_delegated(new.id)
        worktree = self.worktrees.worker_worktree(new.id)
        if not started and (queued is None or (worktree is not None and self.proofs.tests_waiting(worktree.id))):
            return
        delegated = queued is not None or any(task.delegated_to == new.id for task in started)
        help_requested = self.queries.query(Wait).filter(agent_id=new.id, state=WaitState.OPEN, type=WaitType.HELP_REQUEST).exists()
        resume_count = self.queries.query(AgentLine).filter(agent_id=new.id, source=UNFINISHED_TASKS_SOURCE).count()
        person_actor = self.queries.query(ActorRecord).find(change.actor.id).type is ActorType.USER
        if delegated and not help_requested and not person_actor and resume_count < RESUME_LIMIT_COUNT:
            self.nudger.send(new.id, WORKER_UNFINISHED_TASKS, UNFINISHED_TASKS_SOURCE, change.context)
            return
        tasks = ", ".join(f"task:{task.id}" for task in (*started, *self.queued_tasks(new.id)))
        self.nudger.send(new.parent_id, WORKER_ENDED_WITH_TASKS, SOURCE, change.context, worker=new.id, tasks=tasks)

    def queued_tasks(self, worker_id: int) -> tuple[Task, ...]:
        return tuple(self.queries.query(Task).filter(delegated_to=worker_id, state=TaskState.OPEN).all_rows())
