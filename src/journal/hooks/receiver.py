from journal.events.agent.agent_event import AgentEvent
from journal.features.agent_listener import AgentListener
from journal.features.bus import Bus
from journal.hooks.decision import Decision
from journal.hooks.deferred import Deferred
from journal.hooks.hook import Hook
from journal.hooks.translation import Translation
from journal.repositories.entries import Entries
from journal.repositories.environments import Environments


class Receiver:
    """Translates a hook into its agent event, records it as an entry, runs the blocking listeners now and folds their decisions into the answer, and hands the rest to the deferred worker after the reply."""

    def __init__(self, environments: Environments, entries: Entries, translation: Translation, bus: Bus, deferred: Deferred) -> None: ...

    def receive(self, hook: Hook) -> Decision: ...

    def _blocking(self, event: AgentEvent) -> Decision: ...

    def _defer(self, event: AgentEvent) -> None: ...

    def _split(self, event: AgentEvent) -> tuple[list[AgentListener], list[AgentListener]]:
        """The listeners of this event, blocking ones first and deferred ones second."""
        ...
