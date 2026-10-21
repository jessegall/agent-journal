from journal.engine.state_machine import StateMachine
from journal.events.listener import Listener
from journal.events.models.updated import Updated
from journal.features.tasks.states.working import Working
from journal.models.task import Task
from journal.repositories.agents import Agents


class ClosedTaskRelease(Listener[Updated]):
    """An agent working on a task that closes, whoever closed it, goes back to rest; one following a plan with it is moved on by the plan instead."""

    def __init__(self, machine: StateMachine, agents: Agents) -> None:
        self.machine, self.agents = machine, agents

    def handle(self, event: Updated) -> None:
        task = event.model
        if not isinstance(task, Task) or not task.has_just_closed(event.was):
            return
        for agent in self.agents.in_():
            state = self.machine.current(agent.session)
            if isinstance(state, Working) and not state.follows_a_plan() and state.task_id == task.id:
                self.machine.move(agent.session, task.environment_id, self.machine.states.first())
