from journal.engine.agent_state import AgentState
from journal.engine.base_state import BaseState
from journal.engine.nudger import Nudger
from journal.engine.support.settings import Settings
from journal.repositories.setting_rows import SettingRows
from journal.support.features_known import FeaturesKnown
from journal.engine.resume import Resume
from journal.engine.states.ended import Ended
from journal.engine.support.hooked import Hooked
from journal.engine.support.held import Held
from journal.engine.support.stack import Stack
from journal.engine.support.standing import Standing
from journal.engine.states.paused import Paused
from journal.supervisor_link import SupervisorLink
from journal.events.event import Event
from journal.events.rows.row_event import RowEvent
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
from journal.repositories.entries import Entries
from journal.engine.support.trail import Trail
from journal.support.not_found import NotFound


MOVED = "a feature moved the agent"


class Machine(AgentListener[AgentEvent]):
    """The one blocking listener on every agent event: loads the agent's state, asks it, saves the new state, and turns the transition into the decision, with what it says sent through the nudger."""

    blocking = True

    def __init__(self, agents: Agents, states: StatesCatalogue, nudger: Nudger, bus: Bus, settings: SettingRows, features: FeaturesKnown, scope: Scope, supervisor: SupervisorLink, entries: Entries) -> None:
        self.agents, self.states, self.nudger, self.bus = agents, states, nudger, bus
        self.settings, self.features, self.scope, self.supervisor, self.entries = settings, features, scope, supervisor, entries

    def handle(self, event: AgentEvent) -> Decision:
        return self.answer(self.agent(event.session, event.environment_id, event.provider), event)

    def row_event(self, event: RowEvent) -> None:
        with self.scope.of(event.environment_id):
            for agent in self.agents.live_in(event.environment_id):
                self.answer(agent, event)

    def answer(self, agent: Agent, event: Event) -> Decision:
        stack, settings = self.states.stack_of(agent), self.taken()
        transition = stack.top().on(event, settings)
        hooked = self.through_hooks(stack, self.moved(self.placed(stack, transition.to), transition), settings)
        agent = self._settle(agent, hooked, event.key, Actor.system())
        lines = [line for said in (*transition.nudges, *hooked.nudges) if (line := self.nudger.say(agent, said))]
        if transition.held:
            return Decision.refuse(transition.held.rendered())
        if hooked.held:
            return Decision.refuse(hooked.held.nudge.rendered())
        return Decision.tell("\n".join(lines))

    def move(self, session: str, environment_id: int, to: AgentState) -> Agent:
        agent = self.agent(session, environment_id)
        hooked = self.through_hooks(self.states.stack_of(agent), self.placed(self.states.stack_of(agent), to), self.taken())
        settled = self._settle(agent, hooked, MOVED, Actor.system())
        if hooked.held:
            raise Refused(hooked.held.nudge.rendered())
        for line in [line for said in hooked.nudges if (line := self.nudger.say(settled, said))]:
            self.supervisor.type(environment_id, line)
        return settled

    def push(self, session: str, environment_id: int, to: BaseState, by: Actor, words: str) -> Agent:
        agent = self.agent(session, environment_id)
        return self.by_hand(agent, self.states.stack_of(agent).pushed(to), by, words)

    def pop(self, session: str, environment_id: int, by: Actor, words: str) -> Agent:
        agent = self.agent(session, environment_id)
        return self.by_hand(agent, self.states.stack_of(agent).popped(), by, words)

    def reset(self, session: str, environment_id: int, by: Actor, words: str) -> Agent:
        agent = self.agent(session, environment_id)
        return self.by_hand(agent, Stack((self.states.first(),)), by, words)

    def by_hand(self, agent: Agent, after: Stack, by: Actor, words: str) -> Agent:
        hooked = self.through_hooks(self.states.stack_of(agent), after, self.taken())
        settled = self._settle(agent, hooked, words, by)
        if hooked.held:
            raise Refused(hooked.held.nudge.rendered())
        for line in [line for said in hooked.nudges if (line := self.nudger.say(settled, said))]:
            self.supervisor.type(agent.environment_id, line)
        return settled

    def taken(self) -> Settings:
        return Settings.taken(self.settings, self.features.options())

    def through_hooks(self, before: Stack, after: Stack, settings: SettingRows) -> Hooked:
        if after.states[:-1] == before.states and len(after.states) == len(before.states) + 1:
            return self.pushed_through(before, after, settings)
        if after == before.popped() and len(before.states) > 1:
            return self.popped_through(before, after, settings)
        return Hooked(after)

    def pushed_through(self, before: Stack, after: Stack, settings: SettingRows) -> Hooked:
        suspended = before.top().on_suspend(settings)
        pushed = after.top().on_push(settings)
        if isinstance(pushed, Held):
            return Hooked(before, held=pushed, refused=after.top().name)
        return Hooked(after, (*suspended, *pushed))

    def popped_through(self, before: Stack, after: Stack, settings: SettingRows) -> Hooked:
        popped = before.top().on_pop(settings)
        resumed = after.top().on_resume(Standing({}), settings)
        if isinstance(resumed, Transition) and resumed.popped and len(after.states) > 1:
            beneath = self.popped_through(after, after.popped(), settings)
            return Hooked(beneath.stack, (*popped, *resumed.nudges, *beneath.nudges))
        return Hooked(after, (*popped, *resumed))

    def moved(self, stack: Stack, transition: Transition) -> Stack:
        if transition.pushed:
            return stack.pushed(transition.pushed)
        if transition.popped:
            return stack.popped()
        return stack

    def placed(self, stack: Stack, to: BaseState) -> Stack:
        if isinstance(to, Resume):
            return self.resumed(stack, to)
        if type(to) is type(stack.top()):
            return stack.with_top(to)
        if isinstance(to, Paused) and to.resumes(stack.top().name):
            return stack.pushed(to)
        return self.states.stack_under(to)

    def resumed(self, stack: Stack, to: Resume) -> Stack:
        beneath = stack.popped()
        if beneath is not stack and beneath.top().name == to.state:
            return beneath
        return self.states.stack_under(self.states.named(to.state, to.data))

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

    def _settle(self, agent: Agent, hooked: Hooked, cause: str, by: Actor) -> Agent:
        stack, to = hooked.stack, hooked.stack.top()
        if hooked.held:
            self.entries.save(Trail.entry(agent, list(agent.stack), cause, by, refused=hooked.refused, line=hooked.held.nudge.rendered()), by)
        if to.name == agent.state and to.to_data() == agent.data and stack.to_data() == list(agent.stack):
            return agent
        settled = self.agents.save(agent.with_(state=to.name, data=to.to_data(), stack=tuple(stack.to_data())), by)
        self.entries.save(Trail.entry(agent, stack.to_data(), cause, by), by)
        if to.name != agent.state:
            self.bus.dispatch(StateEntered(session=agent.session, environment_id=agent.environment_id, left=agent.state, entered=to.name))
        return settled
