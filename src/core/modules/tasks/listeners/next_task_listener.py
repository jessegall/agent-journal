from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.enums.actor_type import ActorType
from engine.event.logged_event import LoggedEvent
from engine.event.moved import Moved
from engine.listener.commit.commit_listener import CommitListener
from engine.listener.rows.event_rows import EventRows
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.agent_slices import AgentSlices
from core.modules.tasks.commands.assign_next_task.assign_next_task import AssignNextTask
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task

MAIN_WORKING_SLICE = "working.main"


class NextTaskListener(CommitListener[Moved[Task]]):
    """A task the main agent closes or cancels asks for its next task through AssignNextTask, once the new driver's
    working slice answers that agent; until then today's starters do it."""

    name = "tasks.next-task"
    moves = (TaskLifecycle.close, TaskLifecycle.cancel)

    def __init__(self, bus: Bus, rows: EventRows, slices: AgentSlices) -> None:
        self.bus, self.rows, self.slices = bus, rows, slices

    def handle(self, event: Moved[Task], logged: LoggedEvent) -> None:
        holder_id = None if event.old_row is None else event.old_row.holder_id
        if holder_id is None or MAIN_WORKING_SLICE not in self.slices.tick_slices(self.rows.required(Agent, holder_id)):
            return
        self.bus.run(AssignNextTask(holder_id), Actor(holder_id, ActorType.AGENT), cause_id=logged.id)
