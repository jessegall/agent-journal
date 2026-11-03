from core.base.agent_role import AgentRole
from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.support.nudger import Nudger
from core.modules.waits.models.enums.wait_state import WaitState
from core.modules.waits.models.enums.wait_type import WaitType
from core.modules.waits.models.wait import Wait
from core.base.query.conditions.minimum import Minimum
from suites.coding.modules.workers.support.worker_job import UNFINISHED_TASKS_SOURCE
from suites.coding.modules.workers.support.worker_nudges import WORKER_ENDED_WITH_TASKS, WORKER_RESTARTED, WORKER_UNFINISHED_TASKS
from suites.coding.modules.workers.support.worker_stop import WorkerStop
from suites.coding.modules.workers.support.worker_unfinished_tasks import WorkerUnfinishedTasks

SOURCE = "workers.ended-worker"
RESUME_LIMIT_COUNT = 3


class EndedWorkerListener(SaveListener):
    """A worker that ends with delegated tasks unfinished is told to carry on, which resumes it, so its main
    agent gets one quiet line; one that ended while its tests wait gets its next task from them, and one that
    ended while a run of its own goes is started again when the run ends. A worker a person or another agent stopped holds no delegated task or was ended by them; that one,
    one that reported being stuck and one that keeps ending leave its main agent one line naming all its
    tasks."""

    name = "workers.ended-worker"
    event = "agent.update"
    disabled_scopes = [ActorScope]

    def __init__(self, nudger: Nudger, queries: Queries, unfinished: WorkerUnfinishedTasks, stop: WorkerStop) -> None:
        self.nudger, self.queries, self.unfinished, self.stop = nudger, queries, unfinished, stop

    def handle(self, change: Change[Model]) -> None:
        old, new = change.old_row, change.new_row
        if not isinstance(old, Agent) or not isinstance(new, Agent) or old.ended_at is not None or new.ended_at is None:
            return
        if new.role != AgentRole.WORKER or new.parent_id is None:
            return
        unfinished = self.unfinished.rows(new.id)
        if not unfinished or self.unfinished.has_running_process(new.id):
            return
        delegated = any(task.delegated_to == new.id for task in unfinished)
        tasks = self.unfinished.names(unfinished)
        help_requested = self.queries.query(Wait).filter(agent_id=new.id, state=WaitState.OPEN, type=WaitType.HELP_REQUEST).exists()
        task_start = max((task.started_at.text for task in unfinished if task.started_at), default="")
        resume_count = self.queries.query(AgentLine).filter(agent_id=new.id, source=UNFINISHED_TASKS_SOURCE).matching(Minimum("created_at", task_start)).count()
        if delegated and not help_requested and not self.stop.is_final(new, change.actor.id) and resume_count < RESUME_LIMIT_COUNT:
            self.nudger.send(new.id, WORKER_UNFINISHED_TASKS, UNFINISHED_TASKS_SOURCE, change.context)
            self.nudger.send(new.parent_id, WORKER_RESTARTED, SOURCE, change.context, worker=new.id, tasks=tasks)
            return
        self.nudger.send(new.parent_id, WORKER_ENDED_WITH_TASKS, SOURCE, change.context, worker=new.id, tasks=tasks)
