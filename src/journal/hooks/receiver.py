from functools import partial
import time

from journal.features.faults.support.request_timer import RequestTimer
from journal.chat.cards import Cards
from journal.events.agent.agent_event import AgentEvent
from journal.events.agent.stop import Stop
from journal.events.agent.session_ended import SessionEnded
from journal.events.bus import Bus
from journal.events.listener import Listener
from journal.support.decision import Decision
from journal.support.listener_queue import ListenerQueue
from journal.support.hook import Hook
from journal.hooks.support.transcript_turns import TranscriptTurns
from journal.hooks.support.worker_hooks import WorkerHooks
from journal.hooks.translation import Translation
from journal.support.actor import Actor
from journal.models.entry import Entry
from journal.repositories.agents import Agents
from journal.repositories.entries import Entries
from journal.repositories.environments import Environments
from journal.repositories.scope import Scope
from journal.features.faults.support.slow_requests import HOOK, SlowRequests
from journal.support.card_kind import CardKind
from journal.support.hook_kind import HookKind
from journal.engine.support.launch_files import LaunchFiles
from journal.models.environment import Environment


GUARD_FAILED = "guard_failed"
UNBOUND_SESSION = "unbound_session"


class Receiver:
    """Translates a hook into its agent event, records it as an entry, runs the blocking listeners now and folds their decisions into the answer, and hands the rest to the deferred worker after the reply. A hook that does not carry its environment's launch id is recorded and reported, and reaches no listener."""

    def __init__(self, environments: Environments, entries: Entries, translation: Translation, bus: Bus, deferred: ListenerQueue, scope: Scope, transcript: TranscriptTurns, cards: Cards, agents: Agents, slow: SlowRequests, launches: LaunchFiles, worker_hooks: WorkerHooks) -> None:
        self.environments, self.entries, self.translation, self.bus, self.deferred, self.scope = environments, entries, translation, bus, deferred, scope
        self.agents, self.launches = agents, launches
        self.transcript, self.cards, self.slow = transcript, cards, slow
        self.worker_hooks = worker_hooks

    def receive(self, hook: Hook) -> Decision:
        timer = self.slow.begin()
        environment = self.environments.lookup(hook.environment)
        with self.scope.environment(environment.row_id):
            if not self.launches.is_launch(environment.name, hook.launch) and not self.worker_hooks.is_proven(hook):
                return self.unbound(hook, environment)
            self.worker_hooks.bind(hook, environment)
            for saved in self.transcript.events(hook, environment):
                self._immediate(saved)
            event = self.translation.event(hook, environment)
            entry = self.entries.save(Entry(environment_id=environment.row_id, kind=type(event).__name__, actor=Actor.agent(hook.session), data={**hook.stored(), **event.recorded()}), Actor.agent(hook.session))
            if self.is_unknown_session_end(event):
                return Decision()
            decision = self._blocking(event)
            self.entries.save(entry.with_(data={**entry.data, **self.recorded_outcome(hook, decision, timer)}), Actor.agent(hook.session))
            self._defer(event)
        return decision

    def unbound(self, hook: Hook, environment: Environment) -> Decision:
        self.entries.save(Entry(environment_id=environment.row_id, kind=UNBOUND_SESSION, actor=Actor.agent(hook.session), data={**hook.stored(), "launch": hook.launch}), Actor.agent(hook.session))
        if hook.kind == HookKind.SESSION_START:
            self.cards.show(environment.row_id, hook.session, f"Session {hook.session} started without the launch id of {environment.name}: the journal records its hooks and does not take it as this environment's agent", "bolt", tone="bad", shows=CardKind.FAULTS)
        return Decision()

    def recorded_outcome(self, hook: Hook, decision: Decision, timer: RequestTimer) -> dict:
        recorded = {} if decision.allowed else {"refused": decision.reason}
        if not hook.started_ms:
            return recorded
        elapsed = int(time.time() * 1000) - hook.started_ms
        self.slow.measured(HOOK, f"/hooks/{hook.kind.value}", elapsed, timer.cpu_ms())
        return {**recorded, "hook_ms": elapsed}

    def is_unknown_session_end(self, event: AgentEvent) -> bool:
        return isinstance(event, SessionEnded) and not self.agents.matching(session=event.session)

    def _immediate(self, event: AgentEvent) -> None:
        blocking, deferred = self._split(event)
        for listener in [*blocking, *deferred]:
            listener.handle(event)

    def _blocking(self, event: AgentEvent) -> Decision:
        decision = Decision()
        for listener in self._split(event)[0]:
            if not decision.allowed and getattr(listener, "asked_while_free", False):
                self.deferred.add(partial(listener.handle, event))
                continue
            line_text = self._guarded(listener, event)
            if line_text is None:
                continue
            decision = decision.merged(Decision.allowed_with(line_text.reason) if not line_text.allowed and not decision.allowed else line_text)
        return decision

    def _guarded(self, listener: Listener, event: AgentEvent) -> Decision | None:
        try:
            answered = listener.handle(event)
            return answered if isinstance(answered, Decision) else None
        except Exception as fault:
            text = f"{type(listener).__name__} raised {type(fault).__name__}: {fault}"
            self.entries.save(Entry(environment_id=event.environment_id, kind=GUARD_FAILED, actor=Actor.system(), data={"session": event.session, "event": type(event).__name__, "listener": type(listener).__name__, "fault": f"{type(fault).__name__}: {fault}"}), Actor.system())
            self.cards.show(event.environment_id, event.session, f"A guard failed and let the event through: {text}", "bolt", tone="bad", shows=CardKind.FAULTS)
            return Decision.allowed_with(f"[journal] a guard failed and let this through: {text}. the journal recorded it; tell the user if it happens again")

    def _defer(self, event: AgentEvent) -> None:
        for listener in self._split(event)[1]:
            self.deferred.add(partial(listener.handle, event))

    def _split(self, event: AgentEvent) -> tuple[list[Listener], list[Listener]]:
        listeners = self.bus.listeners(type(event))
        blocking = sorted((l for l in listeners if getattr(l, "blocking", False)), key=lambda l: getattr(l, "rank", 1))
        return blocking, [l for l in listeners if not getattr(l, "blocking", False)]
