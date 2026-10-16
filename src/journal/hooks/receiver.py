from journal.engine.machine import Machine
from journal.events.agent.agent_event import AgentEvent
from journal.events.agent.idle import Idle
from journal.features.agent_listener import AgentListener
from journal.features.bus import Bus
from journal.features.listener import Listener
from journal.hooks.decision import Decision
from journal.hooks.deferred import Deferred
from journal.hooks.hook import Hook
from journal.hooks.translation import Translation
from journal.models.actor import Actor
from journal.models.entry import Entry
from journal.repositories.entries import Entries
from journal.repositories.environments import Environments


class Receiver:
    """Translates a hook into its agent event, records it as an entry, runs the blocking listeners now and folds their decisions into the answer, and hands the rest to the deferred worker after the reply."""

    def __init__(self, environments: Environments, entries: Entries, translation: Translation, bus: Bus, deferred: Deferred) -> None:
        self.environments, self.entries, self.translation, self.bus, self.deferred = environments, entries, translation, bus, deferred

    def receive(self, hook: Hook) -> Decision:
        """The hook's decision: what the blocking listeners say, the rest deferred."""
        environment = self.environments.named(hook.environment)
        event = self.translation.event(hook, environment)
        entry = self.entries.save(Entry(environment_id=environment.id, kind=type(event).__name__, actor=Actor.agent(hook.session), data=hook.body), Actor.agent(hook.session))
        decision = self._blocking(event)
        if not decision.allowed:
            self.entries.save(entry.with_(data={**entry.data, "refused": decision.reason}), Actor.agent(hook.session))
        self._defer(event)
        return decision

    def _blocking(self, event: AgentEvent) -> Decision:
        decision = Decision()
        for listener in self._split(event)[0]:
            said = listener.handle(event)
            if said is not None:
                decision = decision.merged(said)
        return decision

    def _defer(self, event: AgentEvent) -> None:
        for listener in self._split(event)[1]:
            self.deferred.add(lambda listener=listener: listener.handle(event))

    def _split(self, event: AgentEvent) -> tuple[list[AgentListener], list[Listener]]:
        """The listeners of this event: the machine first, so every other sees the state the event led to, the other blocking ones next and the deferred ones last."""
        listeners = self.bus.listeners(type(event))
        blocking = sorted((l for l in listeners if getattr(l, "blocking", False)), key=lambda l: not isinstance(l, Machine))
        return blocking, [l for l in listeners if not getattr(l, "blocking", False)]
