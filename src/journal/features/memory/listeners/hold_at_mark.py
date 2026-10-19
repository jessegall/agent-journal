from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.agent_event import AgentEvent
from journal.events.agent_listener import AgentListener
from journal.events.decision import Decision
from journal.support.actor import Actor
from journal.repositories.agents import Agents


class HoldAtMark(AgentListener[AgentEvent]):
    """When the context crosses a mark the agent has not taken yet, the mark is taken and owed on its row and the agent is told to decide what to keep."""

    blocking = True

    def __init__(self, machine: Machine, nudger: Nudger, agents: Agents) -> None:
        self.machine, self.nudger, self.agents = machine, nudger, agents

    def handle(self, event: AgentEvent) -> Decision | None:
        from journal.features.memory.feature import Memory
        if event.context is None or not event.session:
            return None
        agent = self.machine.agent(event.session, event.environment_id)
        due = [mark for mark in Memory.MARKS if event.context * 100 >= mark > agent.context_mark]
        if not due:
            return None
        mark = max(due)
        agent = self.agents.touch(agent, Actor.system(), context_mark=mark, mark_owed=mark)
        line = self.nudger.say(agent, Memory.DECIDE.about(percent=mark))
        return Decision.tell(line) if line else None
