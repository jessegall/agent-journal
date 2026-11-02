from core.base.actor_type import ActorType
from core.base.agent_role import AgentRole
from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.tasks.queries.task_query import TaskQuery
from core.modules.waits.models.enums.wait_state import WaitState
from core.modules.waits.models.enums.wait_type import WaitType
from core.modules.waits.models.wait import Wait
from suites.coding.modules.workers.support.worker_job import UNFINISHED_TASKS_SOURCE
from suites.coding.modules.workers.support.worker_nudges import WORKER_UNFINISHED_TASKS

SOURCE = "workers.ended-worker"
RESUME_LIMIT_COUNT = 3


class EndedWorkerListener(SaveListener):
    """A worker that ends with delegated tasks unfinished is told to carry on, which resumes it, so its main
    agent hears nothing before its last delivery. A worker a person ended holds no delegated task or is ended by that
    person; that one, one that reported being stuck and one that keeps ending leave its main agent a line."""

    name = "workers.ended-worker"
    event = "agent.update"

    def __init__(self, tasks: TaskQuery, repository: Repository, queries: Queries) -> None:
        self.tasks, self.repository, self.queries = tasks, repository, queries

    def handle(self, change: Change[Model]) -> None:
        old, new = change.old_row, change.new_row
        if not isinstance(old, Agent) or not isinstance(new, Agent) or old.ended_at is not None or new.ended_at is None:
            return
        if new.role != AgentRole.WORKER or new.parent_id is None:
            return
        started = tuple(self.tasks.holder(new.id).started().all_rows())
        queued = self.tasks.next_delegated(new.id)
        if not started and queued is None:
            return
        delegated = queued is not None or any(task.delegated_to == new.id for task in started)
        help_requested = self.queries.query(Wait).filter(agent_id=new.id, state=WaitState.OPEN, type=WaitType.HELP_REQUEST).exists()
        resume_count = self.queries.query(AgentLine).filter(agent_id=new.id, source=UNFINISHED_TASKS_SOURCE).count()
        person_actor = self.queries.query(ActorRecord).find(change.actor.id).type is ActorType.USER
        if delegated and not help_requested and not person_actor and resume_count < RESUME_LIMIT_COUNT:
            self.repository.save(AgentLine(agent_id=new.id, creator_id=change.actor.id, text=WORKER_UNFINISHED_TASKS.nudge().text, source=UNFINISHED_TASKS_SOURCE), change.context)
            return
        for task in started:
            line = f"task {task.id} is still started under worker {new.id}: journal worker send {new.id} \"<job>\" to carry on, or journal worker release {new.id} \"<why>\""
            self.repository.save(AgentLine(agent_id=new.parent_id, creator_id=change.actor.id, text=line, source=SOURCE), change.context)
