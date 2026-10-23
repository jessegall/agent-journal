from journal.engine.base_state import BaseState
from journal.models.agent_role import AgentRole
from journal.engine.states.compacting import Compacting
from journal.engine.support.typist import Typist
from journal.engine.nudger import Nudger
from journal.engine.support.settings import Settings
from journal.repositories.setting_rows import SettingRows
from journal.engine.support.feature_registry import FeatureRegistry
from journal.engine.states.ended import Ended
from journal.engine.support.machine_answer import MachineAnswer
from journal.engine.support.machine_reply import MachineReply
from journal.engine.support.block import Block
from journal.engine.support.stack import Stack
from journal.engine.support.data_readers import DataReaders
from journal.events.feature_data import FeatureData
from journal.events.event import Event
from journal.events.rows.row_event import RowEvent
from journal.repositories.scope import Scope
from journal.engine.states_catalogue import StatesCatalogue
from journal.engine.support.transition import Transition
from journal.events.agent.agent_event import AgentEvent
from journal.events.bus import Bus
from journal.support.decision import Decision
from journal.support.actor import Actor
from journal.engine.nudge import Nudge
from journal.models.agent import Agent
from journal.support.rejection import Rejection
from journal.repositories.agents import Agents
from journal.repositories.entries import Entries
from journal.engine.support.stack_history import StackHistory
from journal.engine.support.session_agents import SessionAgents


JOURNAL_START = "the journal started, so no compaction is still running"

class StateMachine:
    """Holds and moves each agent's stack: loads the agent's state, asks it the event, saves the new state, and answers with a reply, the decision and the lines, remarks and terminal moves its states asked for, which the delivery carries out; it reaches no terminal itself."""

    def __init__(self, agents: Agents, states: StatesCatalogue, nudger: Nudger, bus: Bus, settings: SettingRows, features: FeatureRegistry, scope: Scope, entries: Entries, readers: DataReaders, sessions: SessionAgents) -> None:
        self.agents, self.states, self.nudger, self.bus = agents, states, nudger, bus
        self.settings, self.features, self.scope, self.entries, self.readers, self.sessions = settings, features, scope, entries, readers, sessions

    def worker_decision(self, agent_id: int, decision: Decision, event: AgentEvent) -> Decision:
        agent = self.agents.find(agent_id)
        if event.has_hook_lines():
            self.agents.save(agent.with_(queued_lines=()), Actor.system())
            return Decision.allowed_with("\n".join(agent.queued_lines)).merged(decision)
        if decision.context:
            self.agents.save(agent.queued(decision.context), Actor.system())
        return Decision(decision.allowed, decision.reason)

    @staticmethod
    def is_queued_remark(agent: Agent, nudge: Nudge, event: AgentEvent | RowEvent) -> bool:
        return nudge.is_remark and not event.has_hook_lines() and agent.role != AgentRole.WORKER

    def row_replies(self, event: RowEvent) -> list[MachineReply]:
        replies = []
        for agent in self.audience(event):
            with self.scope.environment(agent.environment_id):
                replies.append(self.reply(agent, event.reaching(agent.session)))
        return replies

    def audience(self, event: RowEvent) -> list[Agent]:
        return self.agents.unended_scoped(event.environment_id) if event.environment_id else self.agents.unended()

    def queue_lines(self, agent: Agent, lines: str) -> None:
        self.agents.save(self.agents.find(agent.row_id).queued(lines), Actor.system())

    def mode_change(self, stored_stack: Stack, stack: Stack) -> tuple[Nudge, ...]:
        bottom, previous_bottom = stack.states[0], stored_stack.states[0]
        return bottom.mode_lines() if type(bottom) is not type(previous_bottom) and self.states.is_mode_floor(previous_bottom) else ()

    def reply(self, agent: Agent, event: AgentEvent | RowEvent) -> MachineReply:
        settings = self.top_state()
        stored_stack = self.states.stack(agent)
        stack = self.states.floor(stored_stack, settings, agent.role)
        mode_change = self.mode_change(stored_stack, stack)
        event = event.with_data(self.readers.agent_data(agent))
        transition = stack.top().respond(event, settings, self.features.conducts(agent.role))
        machine_answer = self.hook_machine(stack, self.moved(self.placed(stack, transition.target), transition), settings, event.data)
        if transition.dropped:
            self.entries.save(StackHistory.entry(agent, list(agent.stack), event.key, Actor.system(), dropped=list(transition.dropped)), Actor.system())
        typist = Typist()
        agent = self._store(agent, machine_answer, event.key, Actor.system(), typist)
        nudge_lines = [(nudge, line) for nudge in (*mode_change, *transition.nudges, *machine_answer.nudges) if (line := self.nudger.deliver(agent, nudge))]
        remarks = tuple(line for nudge, line in nudge_lines if self.is_queued_remark(agent, nudge, event))
        lines = [line for _, line in nudge_lines if line not in remarks]
        keystrokes = tuple(line for nudge in transition.terminal_lines if (line := self.nudger.deliver(agent, nudge)))
        reasons = [line for refusal in (transition.refusal, *transition.extra_refusals) if refusal and (line := self.nudger.refuse_with(agent, refusal))]
        if reasons:
            return MachineReply(agent, Decision.refuse("\n".join([*reasons, *lines])), keystrokes, remarks, tuple(typist.moves))
        if machine_answer.refusal and (line := self.nudger.refuse_with(agent, machine_answer.refusal.nudge)):
            return MachineReply(agent, Decision.refuse(line), keystrokes, remarks, tuple(typist.moves))
        answered = MachineReply(agent, Decision.allowed_with("\n".join(lines)), keystrokes, remarks, tuple(typist.moves))
        return answered.merged(self.reply(agent, event)) if transition.handed_down and machine_answer.stack == stack.popped() else answered

    def push(self, session: str, environment_id: int, destination: BaseState, actor: Actor, text: str) -> MachineReply:
        agent = self.sessions.agent(session, environment_id)
        return self.manual(agent, self.states.stack(agent).pushed(destination), actor, text)

    def pop(self, session: str, environment_id: int, actor: Actor, text: str) -> MachineReply:
        agent = self.sessions.agent(session, environment_id)
        return self.manual(agent, self.states.stack(agent).popped(), actor, text)

    def reset(self, session: str, environment_id: int, actor: Actor, text: str) -> MachineReply:
        agent = self.sessions.agent(session, environment_id)
        return self.manual(agent, Stack((self.states.first(),)), actor, text)

    def compactions_ended(self) -> list[MachineReply]:
        return [self.manual(agent, self.states.stack(agent).popped(), Actor.system(), JOURNAL_START) for agent in self.agents.global_state(Compacting.name)]

    def manual(self, agent: Agent, following: Stack, actor: Actor, text: str) -> MachineReply:
        machine_answer = self.hook_machine(self.states.stack(agent), following, self.top_state(), self.readers.agent_data(agent))
        typist = Typist()
        resolved = self._store(agent, machine_answer, text, actor, typist)
        if machine_answer.refusal:
            raise Rejection(machine_answer.refusal.nudge.rendered())
        keystrokes = tuple(line for nudge in machine_answer.nudges if (line := self.nudger.deliver(resolved, nudge)))
        return MachineReply(resolved, Decision(), keystrokes, (), tuple(typist.moves))

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

    def _store(self, agent: Agent, machine_answer: MachineAnswer, cause: str, actor: Actor, typist: Typist) -> Agent:
        stack, destination = machine_answer.stack, machine_answer.stack.top()
        if machine_answer.refusal:
            self.entries.save(StackHistory.entry(agent, list(agent.stack), cause, actor, refused=machine_answer.refused, line=machine_answer.refusal.nudge.rendered()), actor)
        if self.is_unchanged(agent, destination, stack):
            return agent
        stack.replace(self.states.stack(agent), typist)
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
