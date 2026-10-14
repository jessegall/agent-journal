from journal.agent.states_catalogue import StatesCatalogue
from journal.agent.transition import Transition
from journal.events.agent.agent_event import AgentEvent
from journal.features.agent_listener import AgentListener
from journal.repositories.agents import Agents


class Machine(AgentListener[AgentEvent]):
    """The one blocking listener on every agent event: loads the agent's state, asks it, saves the new state, and turns the transition into the decision and the nudges."""

    blocking = True

    def __init__(self, agents: Agents, states: StatesCatalogue) -> None: ...

    def handle(self, event: AgentEvent): ...

    def transition(self, event: AgentEvent) -> Transition: ...

    def move(self, session: str, to) -> None:
        """A command moves the agent too: task start goes to Working, question ask to Waiting."""
        ...
