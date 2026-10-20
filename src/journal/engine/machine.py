from journal.engine.agent_state import AgentState
from journal.engine.nudger import Nudger
from journal.engine.resume import Resume
from journal.support.states_catalogue import StatesCatalogue
from journal.engine.support.transition import Transition
from journal.events.agent.agent_event import AgentEvent
from journal.events.state_entered import StateEntered
from journal.events.bus import Bus
from journal.events.agent_listener import AgentListener
from journal.support.decision import Decision
from journal.support.actor import Actor
from journal.models.agent import Agent
from journal.support.refused import Refused
from journal.repositories.agents import Agents
from journal.support.not_found import NotFound


class Machine(AgentListener[AgentEvent]):
    """The one blocking listener on every agent event: loads the agent's state, asks it, saves the new state, and turns the transition into the decision, with what it says sent through the nudger."""

    blocking = True

    def __init__(self, agents: Agents, states: StatesCatalogue, nudger: Nudger, bus: Bus) -> None:
        self.agents, self.states, self.nudger, self.bus = agents, states, nudger, bus

    def handle(self, event: AgentEvent) -> Decision:
        agent = self.agent(event.session, event.environment_id, event.provider)
        transition = self.states.named(agent.state, agent.data).on(event)
        agent = self._settle(agent, transition.to)
        lines = [line for said in transition.nudges if (line := self.nudger.say(agent, said))]
        if transition.held:
            return Decision.refuse(transition.held.rendered())
        return Decision.tell("\n".join(lines))

    def move(self, session: str, environment_id: int, to: AgentState) -> Agent:
        return self._settle(self.agent(session, environment_id), to)

    def current(self, session: str) -> AgentState:
        agent = self.agents.for_session(session)
        return self.states.named(agent.state, agent.data)

    def agent(self, session: str, environment_id: int, provider: str = "") -> Agent:
        if not session:
            raise Refused("no agent runs this, so there is no agent to move: only an agent's own session can")
        try:
            return self.agents.for_session(session)
        except NotFound:
            first = self.states.first()
            return self.agents.save(Agent(environment_id=environment_id, session=session, provider=provider, state=first.name, data=first.to_data()), Actor.system())

    def _settle(self, agent: Agent, to: AgentState) -> Agent:
        if isinstance(to, Resume):
            to = self.states.named(to.state, to.data)
        if to.name == agent.state and to.to_data() == agent.data:
            return agent
        settled = self.agents.save(agent.with_(state=to.name, data=to.to_data()), Actor.system())
        if to.name != agent.state:
            self.bus.dispatch(StateEntered(session=agent.session, environment_id=agent.environment_id, left=agent.state, entered=to.name))
        return settled
