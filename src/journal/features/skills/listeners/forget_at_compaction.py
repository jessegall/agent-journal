from journal.engine.state_machine import StateMachine
from journal.events.agent.compacting import Compacting
from journal.events.agent_listener import AgentListener
from journal.support.actor import Actor
from journal.repositories.agents import Agents


class ForgetAtCompaction(AgentListener[Compacting]):
    """A compacted window has not read the skills it read; they are owed again."""

    blocking = True

    def __init__(self, machine: StateMachine, agents: Agents) -> None:
        self.machine, self.agents = machine, agents

    def handle(self, event: Compacting) -> None:
        agent = self.machine.agent(event.session, event.environment_id)
        self.agents.save(agent.with_(skills_loaded={}), Actor.system())
