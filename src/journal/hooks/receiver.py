from journal.events.hook_received import HookReceived
from journal.features.bus import Bus
from journal.hooks.decision import Decision
from journal.hooks.deferred import Deferred
from journal.hooks.hook import Hook
from journal.hooks.hook_listener import HookListener
from journal.repositories.entries import Entries
from journal.repositories.environments import Environments


class Receiver:
    """Records a hook as an entry, runs the blocking listeners now and folds their decisions into the answer, and hands the rest to the deferred worker after the reply."""

    def __init__(self, environments: Environments, entries: Entries, bus: Bus, deferred: Deferred) -> None: ...

    def receive(self, hook: Hook) -> Decision: ...

    def _blocking(self, event: HookReceived) -> Decision: ...

    def _defer(self, event: HookReceived) -> None: ...

    def _split(self) -> tuple[list[HookListener], list[HookListener]]:
        """The hook listeners, blocking ones first and deferred ones second."""
        ...
