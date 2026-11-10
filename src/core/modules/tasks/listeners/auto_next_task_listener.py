from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from engine.change.moved import Moved
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.enums.agent_role import AgentRole
from engine.change.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.listener.commit_listener import CommitListener
from engine.listener.event_rows import EventRows
from core.modules.agents.models.agent import Agent
from core.modules.tasks.commands.start_task.start_task import StartTask
from core.modules.tasks.models.task import Task
from core.modules.tasks.rules.support.current_tasks import CurrentTasks
from core.modules.tasks.support.suite_task_assigners import SuiteTaskAssigners



class AutoNextTaskListener(CommitListener[Moved[Task]]):
    """While the suite's task assigner hands out tasks by itself, a task that leaves the main agent's hands, closed,
    cancelled, blocked or released, is followed at once by the next task, started for that agent; with other
    tasks still in its hands, only an urgent task is started."""

    name = "tasks.auto-next-task"
    moves = (TaskLifecycle.close, TaskLifecycle.cancel, TaskLifecycle.block, TaskLifecycle.release)

    def __init__(self, bus: Bus, rows: EventRows, current: CurrentTasks, assigners: SuiteTaskAssigners) -> None:
        self.bus, self.rows, self.current, self.assigners = bus, rows, current, assigners

    def handle(self, event: Moved[Task], logged: LoggedEvent) -> None:
        closed_task = event.row
        assigner = self.assigners.assigner()
        if assigner is None or not assigner.is_automatic():
            return
        previous = event.old_row
        holder_id = None if previous is None else previous.holder_id
        if holder_id is None:
            return
        holder = self.rows.required(Agent, holder_id)
        if holder.role != AgentRole.MAIN or holder.ended_at is not None or assigner.exceeds_context_limit(holder_id):
            return
        excluded_id = closed_task.id if event.move is TaskLifecycle.release else None
        next_row = assigner.urgent(excluded_id) if self.current.started_tasks(holder_id) else assigner.following(holder_id, excluded_id)
        if next_row is not None:
            self.bus.run(StartTask(next_row.id), Actor(holder_id, ActorType.AGENT), cause_id=logged.id)
