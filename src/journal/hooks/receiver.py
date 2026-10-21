import time

from journal.support.cards import Cards
from journal.engine.state_machine import StateMachine
from journal.events.agent.agent_event import AgentEvent
from journal.events.agent.idle import Idle
from journal.events.agent.session_ended import SessionEnded
from journal.events.agent_listener import AgentListener
from journal.events.bus import Bus
from journal.events.listener import Listener
from journal.support.decision import Decision
from journal.support.deferred import Deferred
from journal.support.hook import Hook
from journal.hooks.support.transcript_turns import TranscriptTurns
from journal.hooks.translation import Translation
from journal.support.actor import Actor
from journal.models.entry import Entry
from journal.repositories.agents import Agents
from journal.repositories.entries import Entries
from journal.repositories.environments import Environments
from journal.support.scope import Scope
from journal.support.slow_requests import HOOK, SlowRequests
from journal.support.chat_mark import ChatMark


GUARD_FAILED = "guard_failed"
"""The entry a blocking listener leaves when it raises: the event, the listener and the fault, so the page can show it."""


class Receiver:
    """Translates a hook into its agent event, records it as an entry, runs the blocking listeners now and folds their decisions into the answer, and hands the rest to the deferred worker after the reply."""

    def __init__(self, environments: Environments, entries: Entries, translation: Translation, bus: Bus, deferred: Deferred, scope: Scope, transcript: TranscriptTurns, cards: Cards, agents: Agents, slow: SlowRequests) -> None:
        self.environments, self.entries, self.translation, self.bus, self.deferred, self.scope = environments, entries, translation, bus, deferred, scope
        self.agents = agents
        self.transcript, self.cards, self.slow = transcript, cards, slow

    def receive(self, hook: Hook) -> Decision:
        environment = self.environments.named(hook.environment)
        with self.scope.of(environment.id):
            for written in self.transcript.events(hook, environment):
                self._handle_at_once(written)
            event = self.translation.event(hook, environment)
            entry = self.entries.save(Entry(environment_id=environment.id, kind=type(event).__name__, actor=Actor.agent(hook.session), data={**hook.stored(), **event.recorded()}), Actor.agent(hook.session))
            if self.is_unknown_session_end(event):
                return Decision()
            decision = self._blocking(event)
            self.entries.save(entry.with_(data={**entry.data, **self.recorded_outcome(hook, decision)}), Actor.agent(hook.session))
            self._defer(event)
        return decision

    def recorded_outcome(self, hook: Hook, decision: Decision) -> dict:
        recorded = {} if decision.allowed else {"refused": decision.reason}
        if not hook.started_ms:
            return recorded
        elapsed = int(time.time() * 1000) - hook.started_ms
        self.slow.measured(HOOK, f"/hooks/{hook.kind.value}", elapsed)
        return {**recorded, "hook_ms": elapsed}

    def is_unknown_session_end(self, event: AgentEvent) -> bool:
        return isinstance(event, SessionEnded) and not self.agents.where(session=event.session)

    def _handle_at_once(self, event: AgentEvent) -> None:
        blocking, deferred = self._split(event)
        for listener in [*blocking, *deferred]:
            listener.handle(event)

    def _blocking(self, event: AgentEvent) -> Decision:
        decision = Decision()
        for listener in self._split(event)[0]:
            if not decision.allowed and getattr(listener, "asked_while_free", False):
                self.deferred.add(lambda listener=listener: listener.handle(event))
                continue
            said = self._guarded(listener, event)
            if said is None:
                continue
            decision = decision.merged(Decision.allowed_with(said.reason) if not said.allowed and not decision.allowed else said)
        return decision

    def _guarded(self, listener: Listener, event: AgentEvent) -> Decision | None:
        try:
            return listener.handle(event)
        except Exception as fault:
            words = f"{type(listener).__name__} raised {type(fault).__name__}: {fault}"
            self.entries.save(Entry(environment_id=event.environment_id, kind=GUARD_FAILED, actor=Actor.system(), data={"session": event.session, "event": type(event).__name__, "listener": type(listener).__name__, "fault": f"{type(fault).__name__}: {fault}"}), Actor.system())
            self.cards.show(event.environment_id, event.session, f"A guard failed and let the event through: {words}", "bolt", tone="bad", shows=ChatMark.FAULTS)
            return Decision.allowed_with(f"[journal] a guard failed and let this through: {words}. the journal recorded it; tell the user if it happens again")

    def _defer(self, event: AgentEvent) -> None:
        for listener in self._split(event)[1]:
            self.deferred.add(lambda listener=listener: listener.handle(event))

    def _split(self, event: AgentEvent) -> tuple[list[AgentListener], list[Listener]]:
        listeners = self.bus.listeners(type(event))
        blocking = sorted((l for l in listeners if getattr(l, "blocking", False)), key=lambda l: (not isinstance(l, StateMachine), getattr(l, "asked_last", False)))
        return blocking, [l for l in listeners if not getattr(l, "blocking", False)]
