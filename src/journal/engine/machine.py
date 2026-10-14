from journal.engine.agent_state import AgentState
from journal.engine.nudger import Nudger
from journal.engine.states_catalogue import StatesCatalogue
from journal.engine.transition import Transition
from journal.events.agent.agent_event import AgentEvent
from journal.features.agent_listener import AgentListener
from journal.hooks.decision import Decision
from journal.repositories.agents import Agents


class Machine(AgentListener[AgentEvent]):
    """The one blocking listener on every agent event: loads the agent's state, asks it, saves the new state, and turns the transition into the decision, with what it says sent through the nudger."""

    blocking = True

    def __init__(self, agents: Agents, states: StatesCatalogue, nudger: Nudger) -> None: ...

    def handle(self, event: AgentEvent) -> Decision: ...

    def transition(self, event: AgentEvent) -> Transition: ...

    def move(self, session: str, to: AgentState) -> None:
        """A feature moves the agent too: task start goes to Working, question ask to Waiting."""
        ...
