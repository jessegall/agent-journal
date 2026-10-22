from journal.engine.base_state import BaseState
from journal.engine.states.compacting import Compacting
from journal.events.agent.tool_starting import ToolStarting
from journal.engine.support.typist import Typist
from journal.engine.nudger import Nudger
from journal.engine.support.settings import Settings
from journal.repositories.setting_rows import SettingRows
from journal.engine.support.feature_registry import FeatureRegistry
from journal.engine.states.ended import Ended
from journal.engine.support.machine_answer import MachineAnswer
from journal.engine.support.block import Block
from journal.engine.support.stack import Stack
from journal.engine.support.data_readers import DataReaders
from journal.events.feature_data import FeatureData
from journal.supervisor_link import SupervisorLink
from journal.events.event import Event
from journal.events.rows.row_event import RowEvent
from journal.repositories.scope import Scope
from journal.engine.states_catalogue import StatesCatalogue
from journal.engine.support.transition import Transition
from journal.events.agent.agent_event import AgentEvent
from journal.events.bus import Bus
from journal.events.agent_listener import AgentListener
from journal.support.decision import Decision
from journal.support.actor import Actor
from journal.models.agent import Agent
from journal.support.rejection import Rejection
from journal.repositories.agents import Agents
from journal.repositories.entries import Entries
from journal.engine.support.stack_history import StackHistory
from journal.engine.support.session_agents import SessionAgents


MOVED = "a feature moved the agent"

JOURNAL_START = "the journal started, so no compaction is still running"

class StateMachine(AgentListener[AgentEvent]):
    """The one blocking listener on every agent event: loads the agent's state, asks it, saves the new state, and turns the transition into the decision, with what it says sent through the nudger."""

    blocking = True

    rank = 0

    def __init__(self, agents: Agents, states: StatesCatalogue, nudger: Nudger, bus: Bus, settings: SettingRows, features: FeatureRegistry, scope: Scope, supervisor: SupervisorLink, entries: Entries, readers: DataReaders, sessions: SessionAgents) -> None:
        self.agents, self.states, self.nudger, self.bus = agents, states, nudger, bus
        self.settings, self.features, self.scope, self.supervisor, self.entries, self.readers, self.sessions = settings, features, scope, supervisor, entries, readers, sessions

    def handle(self, event: AgentEvent) -> Decision:
        if isinstance(event, ToolStarting) and event.call.is_panic_line():
            return Decision()
        decision = self.answer(self.sessions.agent(event.session, event.environment_id, event.provider), event)
        if decision.context and not (event.answers_hook and event.has_lines):
            self.type_lines(event.environment_id, decision.context, event.typing_delay)
        return decision

    def type_lines(self, environment_id: int, lines: str, following: float) -> None:
        for line in lines.split("\n"):
            self.supervisor.type(environment_id, line, following=following)

    def row_event(self, event: RowEvent) -> None:
        for agent in self.audience(event):
            with self.scope.environment(agent.environment_id):
                answered = self.answer(agent, event.reaching(agent.session))
            if answered.context:
                self.type_lines(agent.environment_id, answered.context, 0.0)

    def audience(self, event: RowEvent) -> list[Agent]:
        listeners = self.agents.main_scoped(event.environment_id) if event.environment_id else self.agents.main_unended()
        recipients = [agent for agent in self.agents.global_matching(session=event.recipient) if event.recipient and agent.state != "ended" and agent not in listeners]
        return [*listeners, *recipients]

    def answer(self, agent: Agent, event: AgentEvent | RowEvent) -> Decision:
        settings = self.top_state()
        stack = self.states.apply_mode(self.states.stack(agent), settings)
        event = event.with_data(self.readers.agent_data(agent))
        transition = stack.top().respond(event, settings, self.features.conducts())
        machine_answer = self.hook_machine(stack, self.moved(self.placed(stack, transition.target), transition), settings, event.data)
        if transition.dropped:
            self.entries.save(StackHistory.entry(agent, list(agent.stack), event.key, Actor.system(), dropped=list(transition.dropped)), Actor.system())
        agent = self._store(agent, machine_answer, event.key, Actor.system())
        lines = [line for nudge in (*transition.nudges, *machine_answer.nudges) if (line := self.nudger.deliver(agent, nudge))]
        keystrokes = [line for nudge in transition.terminal_lines if (line := self.nudger.deliver(agent, nudge))]
        for line in keystrokes:
            self.supervisor.type(agent.environment_id, line, following=event.typing_delay)
        reasons = [line for refusal in (transition.refusal, *transition.extra_refusals) if refusal and (line := self.nudger.refuse_with(agent, refusal))]
        if reasons:
            return Decision.refuse("\n".join([*reasons, *lines]))
        if machine_answer.refusal and (line := self.nudger.refuse_with(agent, machine_answer.refusal.nudge)):
            return Decision.refuse(line)
        answered = Decision.allowed_with("\n".join(lines))
        return answered.merged(self.answer(agent, event)) if transition.handed_down and machine_answer.stack == stack.popped() else answered

    def move(self, session: str, environment_id: int, destination: BaseState) -> Agent:
        agent = self.sessions.agent(session, environment_id)
        machine_answer = self.hook_machine(self.states.stack(agent), self.placed(self.states.stack(agent), destination), self.top_state(), self.readers.agent_data(agent))
        resolved = self._store(agent, machine_answer, MOVED, Actor.system())
        if machine_answer.refusal:
            raise Rejection(machine_answer.refusal.nudge.rendered())
        for line in [line for nudge in machine_answer.nudges if (line := self.nudger.deliver(resolved, nudge))]:
            self.supervisor.type(environment_id, line)
        return resolved

    def push(self, session: str, environment_id: int, destination: BaseState, actor: Actor, text: str) -> Agent:
        agent = self.sessions.agent(session, environment_id)
        return self.manual(agent, self.states.stack(agent).pushed(destination), actor, text)

    def pop(self, session: str, environment_id: int, actor: Actor, text: str) -> Agent:
        agent = self.sessions.agent(session, environment_id)
        return self.manual(agent, self.states.stack(agent).popped(), actor, text)

    def reset(self, session: str, environment_id: int, actor: Actor, text: str) -> Agent:
        agent = self.sessions.agent(session, environment_id)
        return self.manual(agent, Stack((self.states.first(),)), actor, text)

    def compactions_ended(self) -> None:
        for agent in self.agents.global_state(Compacting.name):
            self.manual(agent, self.states.stack(agent).popped(), Actor.system(), JOURNAL_START)

    def manual(self, agent: Agent, following: Stack, actor: Actor, text: str) -> Agent:
        machine_answer = self.hook_machine(self.states.stack(agent), following, self.top_state(), self.readers.agent_data(agent))
        resolved = self._store(agent, machine_answer, text, actor)
        if machine_answer.refusal:
            raise Rejection(machine_answer.refusal.nudge.rendered())
        for line in [line for nudge in machine_answer.nudges if (line := self.nudger.deliver(resolved, nudge))]:
            self.supervisor.type(agent.environment_id, line)
        return resolved

    def top_state(self) -> Settings:
        return Settings.applied(self.settings, self.features.options())


    def hook_machine(self, previous: Stack, following: Stack, settings: Settings, data: FeatureData) -> MachineAnswer:
        if following.states[:-1] == previous.states and len(following.states) == len(previous.states) + 1:
            return self.pushed_down(previous, following, settings)
        if following == previous.popped() and len(previous.states) > 1:
            return self.forwarded(previous, following, settings, data)
        return MachineAnswer(following)

    def pushed_down(self, previous: Stack, following: Stack, settings: Settings) -> MachineAnswer:
        suspended = previous.top().on_suspend(settings)
        pushed = following.top().on_push(settings)
        if isinstance(pushed, Block):
            return MachineAnswer(previous, refusal=pushed, refused=following.top().name)
        return MachineAnswer(following, (*suspended, *pushed))

    def forwarded(self, previous: Stack, following: Stack, settings: Settings, data: FeatureData) -> MachineAnswer:
        popped = previous.top().on_pop(settings)
        resumed = following.top().on_resume(data, settings)
        if not isinstance(resumed, Transition):
            return MachineAnswer(following, (*popped, *resumed))
        if resumed.popped and len(following.states) > 1:
            lower = self.forwarded(following, following.popped(), settings, data)
            return MachineAnswer(lower.stack, (*popped, *resumed.nudges, *lower.nudges))
        return MachineAnswer(following.with_top(resumed.target), (*popped, *resumed.nudges))

    def moved(self, stack: Stack, transition: Transition) -> Stack:
        if transition.pushed:
            return stack.pushed(transition.pushed)
        if transition.popped:
            return stack.popped()
        return stack

    def placed(self, stack: Stack, destination: BaseState) -> Stack:
        if type(destination) is type(stack.top()):
            return stack.with_top(destination)
        return self.states.stack_base(destination)

    def lifecycle(self, agent: Agent, following: Stack) -> None:
        previous = self.states.stack(agent)
        typist = Typist(self.supervisor, agent.environment_id)
        kinds_tail, kinds_head = {type(s) for s in following.states}, {type(s) for s in previous.states}
        for state in previous.states:
            if type(state) not in kinds_tail:
                state.on_exit(typist)
        for state in following.states:
            if type(state) not in kinds_head:
                state.on_enter(typist)

    def _store(self, agent: Agent, machine_answer: MachineAnswer, cause: str, actor: Actor) -> Agent:
        stack, destination = machine_answer.stack, machine_answer.stack.top()
        if machine_answer.refusal:
            self.entries.save(StackHistory.entry(agent, list(agent.stack), cause, actor, refused=machine_answer.refused, line=machine_answer.refusal.nudge.rendered()), actor)
        if self.is_unchanged(agent, destination, stack):
            return agent
        self.lifecycle(agent, stack)
        resolved = self.agents.save(agent.with_(state=destination.name, data=destination.serialized(), stack=tuple(stack.serialized())), actor)
        if self.is_moved(agent, stack):
            self.entries.save(StackHistory.entry(agent, stack.serialized(), cause, actor), actor)
        return resolved

    @staticmethod
    def is_unchanged(agent: Agent, destination: BaseState, stack: Stack) -> bool:
        return destination.name == agent.state and destination.serialized() == agent.data and stack.serialized() == list(agent.stack)

    @staticmethod
    def is_moved(agent: Agent, stack: Stack) -> bool:
        return [state.name for state in stack.states] != [row["state"] for row in agent.stack]
