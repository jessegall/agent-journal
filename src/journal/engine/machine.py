from journal.engine.agent_state import AgentState
from journal.engine.base_state import BaseState
from journal.engine.nudger import Nudger
from journal.engine.support.settings import Settings
from journal.repositories.settings import Settings as SettingRows
from journal.support.features_known import FeaturesKnown
from journal.engine.resume import Resume
from journal.engine.states.ended import Ended
from journal.engine.support.stack import Stack
from journal.events.event import Event
from journal.support.scope import Scope
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

    def __init__(self, agents: Agents, states: StatesCatalogue, nudger: Nudger, bus: Bus, settings: SettingRows, features: FeaturesKnown, scope: Scope) -> None:
        self.agents, self.states, self.nudger, self.bus = agents, states, nudger, bus
        self.settings, self.features, self.scope = settings, features, scope

    def handle(self, event: AgentEvent) -> Decision:
        return self.answer(self.agent(event.session, event.environment_id, event.provider), event)

    def row_event(self, event: Event, environment_id: int) -> None:
        with self.scope.of(environment_id):
            for agent in self.agents.in_():
                if not isinstance(self.states.stack_of(agent).top(), Ended):
                    self.answer(agent, event)

    def answer(self, agent: Agent, event: Event) -> Decision:
        stack = self.states.stack_of(agent)
        transition = stack.top().on(event, Settings.taken(self.settings, self.features.options()))
        agent = self._settle(agent, self.moved(self.placed(stack, transition.to), transition))
        lines = [line for said in transition.nudges if (line := self.nudger.say(agent, said))]
        if transition.held:
            return Decision.refuse(transition.held.rendered())
        return Decision.tell("\n".join(lines))

    def move(self, session: str, environment_id: int, to: AgentState) -> Agent:
        agent = self.agent(session, environment_id)
        return self._settle(agent, self.placed(self.states.stack_of(agent), to))

    def moved(self, stack: Stack, transition: Transition) -> Stack:
        if transition.pushed:
            return stack.pushed(transition.pushed)
        if transition.popped:
            return stack.popped()
        return stack

    def placed(self, stack: Stack, to: BaseState) -> Stack:
        if isinstance(to, Resume):
            return self.states.stack_under(self.states.named(to.state, to.data))
        return self.states.stack_under(to)

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

    def _settle(self, agent: Agent, stack: Stack) -> Agent:
        to = stack.top()
        if to.name == agent.state and to.to_data() == agent.data and stack.to_data() == list(agent.stack):
            return agent
        settled = self.agents.save(agent.with_(state=to.name, data=to.to_data(), stack=tuple(stack.to_data())), Actor.system())
        if to.name != agent.state:
            self.bus.dispatch(StateEntered(session=agent.session, environment_id=agent.environment_id, left=agent.state, entered=to.name))
        return settled
