from journal.engine.base_state import BaseState
from journal.engine.nudger import Nudger
from journal.engine.support.settings import Settings
from journal.repositories.setting_rows import SettingRows
from journal.support.features_known import FeaturesKnown
from journal.engine.states.ended import Ended
from journal.engine.support.hooked import Hooked
from journal.engine.support.held import Held
from journal.engine.support.stack import Stack
from journal.engine.support.readings_readers import ReadingsReaders
from journal.events.readings import Readings
from journal.supervisor_link import SupervisorLink
from journal.events.event import Event
from journal.events.rows.row_event import RowEvent
from journal.support.scope import Scope
from journal.support.states_catalogue import StatesCatalogue
from journal.engine.support.transition import Transition
from journal.events.agent.agent_event import AgentEvent
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


class StateMachine(AgentListener[AgentEvent]):
    """The one blocking listener on every agent event: loads the agent's state, asks it, saves the new state, and turns the transition into the decision, with what it says sent through the nudger."""

    blocking = True

    def __init__(self, agents: Agents, states: StatesCatalogue, nudger: Nudger, bus: Bus, settings: SettingRows, features: FeaturesKnown, scope: Scope, supervisor: SupervisorLink, entries: Entries, readers: ReadingsReaders) -> None:
        self.agents, self.states, self.nudger, self.bus = agents, states, nudger, bus
        self.settings, self.features, self.scope, self.supervisor, self.entries, self.readers = settings, features, scope, supervisor, entries, readers

    def handle(self, event: AgentEvent) -> Decision:
        decision = self.answer(self.agent(event.session, event.environment_id, event.provider), event)
        if decision.context and not (event.answers_hook and event.carries_lines):
            self.type_lines(event.environment_id, decision.context, event.typed_after)
        return decision

    def type_lines(self, environment_id: int, lines: str, after: float) -> None:
        for line in lines.split("\n"):
            self.supervisor.type(environment_id, line, after=after)

    def row_event(self, event: RowEvent) -> None:
        for agent in self.agents.live_in(event.environment_id) if event.environment_id else self.agents.live_everywhere():
            with self.scope.of(agent.environment_id):
                answered = self.answer(agent, event.reaching(agent.session))
            if answered.context:
                self.type_lines(agent.environment_id, answered.context, 0.0)

    def answer(self, agent: Agent, event: Event) -> Decision:
        stack, settings = self.states.stack_of(agent), self.taken()
        event = event.with_readings(self.readers.for_agent(agent))
        transition = stack.top().on(event, settings)
        hooked = self.through_hooks(stack, self.moved(self.placed(stack, transition.to), transition), settings, event.readings)
        if transition.dropped:
            self.entries.save(Trail.entry(agent, list(agent.stack), event.key, Actor.system(), dropped=list(transition.dropped)), Actor.system())
        agent = self._settle(agent, hooked, event.key, Actor.system())
        lines = [line for nudge in (*transition.nudges, *hooked.nudges) if (line := self.nudger.say(agent, nudge))]
        typed = [line for nudge in transition.typed if (line := self.nudger.say(agent, nudge))]
        for line in typed:
            self.supervisor.type(agent.environment_id, line, after=event.typed_after)
        reasons = [line for refusal in (transition.held, *transition.other_holds) if refusal and (line := self.nudger.refuse_with(agent, refusal))]
        if reasons:
            return Decision.refuse("\n".join([*reasons, *lines]))
        if hooked.held and (line := self.nudger.refuse_with(agent, hooked.held.nudge)):
            return Decision.refuse(line)
        return Decision.allowed_with("\n".join(lines))

    def move(self, session: str, environment_id: int, to: BaseState) -> Agent:
        agent = self.agent(session, environment_id)
        hooked = self.through_hooks(self.states.stack_of(agent), self.placed(self.states.stack_of(agent), to), self.taken(), self.read_for(agent))
        settled = self._settle(agent, hooked, MOVED, Actor.system())
        if hooked.held:
            raise Refused(hooked.held.nudge.rendered())
        for line in [line for nudge in hooked.nudges if (line := self.nudger.say(settled, nudge))]:
            self.supervisor.type(environment_id, line)
        return settled

    def push(self, session: str, environment_id: int, to: BaseState, actor: Actor, text: str) -> Agent:
        agent = self.agent(session, environment_id)
        return self.by_hand(agent, self.states.stack_of(agent).pushed(to), actor, text)

    def pop(self, session: str, environment_id: int, actor: Actor, text: str) -> Agent:
        agent = self.agent(session, environment_id)
        return self.by_hand(agent, self.states.stack_of(agent).popped(), actor, text)

    def reset(self, session: str, environment_id: int, actor: Actor, text: str) -> Agent:
        agent = self.agent(session, environment_id)
        return self.by_hand(agent, Stack((self.states.first(),)), actor, text)

    def by_hand(self, agent: Agent, after: Stack, actor: Actor, text: str) -> Agent:
        hooked = self.through_hooks(self.states.stack_of(agent), after, self.taken(), self.read_for(agent))
        settled = self._settle(agent, hooked, text, actor)
        if hooked.held:
            raise Refused(hooked.held.nudge.rendered())
        for line in [line for nudge in hooked.nudges if (line := self.nudger.say(settled, nudge))]:
            self.supervisor.type(agent.environment_id, line)
        return settled

    def taken(self) -> Settings:
        return Settings.taken(self.settings, self.features.options())

    def read_for(self, agent: Agent) -> Readings:
        with self.scope.of(agent.environment_id):
            return self.readers.for_agent(agent)

    def through_hooks(self, before: Stack, after: Stack, settings: SettingRows, readings: Readings) -> Hooked:
        if after.states[:-1] == before.states and len(after.states) == len(before.states) + 1:
            return self.pushed_through(before, after, settings)
        if after == before.popped() and len(before.states) > 1:
            return self.popped_through(before, after, settings, readings)
        return Hooked(after)

    def pushed_through(self, before: Stack, after: Stack, settings: SettingRows) -> Hooked:
        suspended = before.top().on_suspend(settings)
        pushed = after.top().on_push(settings)
        if isinstance(pushed, Held):
            return Hooked(before, held=pushed, refused=after.top().name)
        return Hooked(after, (*suspended, *pushed))

    def popped_through(self, before: Stack, after: Stack, settings: SettingRows, readings: Readings) -> Hooked:
        popped = before.top().on_pop(settings)
        resumed = after.top().on_resume(readings, settings)
        if not isinstance(resumed, Transition):
            return Hooked(after, (*popped, *resumed))
        if resumed.popped and len(after.states) > 1:
            beneath = self.popped_through(after, after.popped(), settings, readings)
            return Hooked(beneath.stack, (*popped, *resumed.nudges, *beneath.nudges))
        return Hooked(after.with_top(resumed.to), (*popped, *resumed.nudges))

    def moved(self, stack: Stack, transition: Transition) -> Stack:
        if transition.pushed:
            return stack.pushed(transition.pushed)
        if transition.popped:
            return stack.popped()
        return stack

    def placed(self, stack: Stack, to: BaseState) -> Stack:
        if type(to) is type(stack.top()):
            return stack.with_top(to)
        return self.states.stack_under(to)

    def current(self, session: str) -> BaseState:
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

    def follow_silence(self, agent: Agent, top: BaseState) -> None:
        former = self.states.named(agent.state, agent.data)
        if top.is_silent() and not former.is_silent():
            self.supervisor.pause(agent.environment_id)
        if former.is_silent() and not top.is_silent():
            self.supervisor.resume(agent.environment_id)

    def _settle(self, agent: Agent, hooked: Hooked, cause: str, actor: Actor) -> Agent:
        stack, to = hooked.stack, hooked.stack.top()
        if hooked.held:
            self.entries.save(Trail.entry(agent, list(agent.stack), cause, actor, refused=hooked.refused, line=hooked.held.nudge.rendered()), actor)
        if to.name == agent.state and to.to_data() == agent.data and stack.to_data() == list(agent.stack):
            return agent
        self.follow_silence(agent, to)
        settled = self.agents.save(agent.with_(state=to.name, data=to.to_data(), stack=tuple(stack.to_data())), actor)
        self.entries.save(Trail.entry(agent, stack.to_data(), cause, actor), actor)
        return settled
