from journal.engine.base_state import BaseState
from journal.engine.states_catalogue import StatesCatalogue
from journal.models.agent import Agent
from journal.repositories.agents import Agents
from journal.providers.providers import Providers
from journal.support.actor import Actor
from journal.support.missing_row import MissingRow
from journal.support.rejection import Rejection


class SessionAgents:
    """The agent row of a session, made at rest when the session is new, and the state on top of its stack."""

    def __init__(self, agents: Agents, states: StatesCatalogue, providers: Providers) -> None:
        self.agents, self.states, self.providers = agents, states, providers

    def agent(self, session: str, environment_id: int, provider: str = "") -> Agent:
        if not session:
            raise Rejection("no agent runs this, so there is no agent to move: only an agent's own session can")
        try:
            return self.agents.session_agent(session)
        except MissingRow:
            first = self.states.first()
            return self.agents.save(Agent(environment_id=environment_id, session=session, provider=provider or self.providers.default().name, state=first.name, data=first.serialized()), Actor.system())

    def top(self, session: str) -> BaseState:
        agent = self.agents.session_agent(session)
        return self.states.restored(agent.state, agent.data)
