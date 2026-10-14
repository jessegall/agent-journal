from journal.features.bus import Bus
from journal.hooks.decision import Decision
from journal.hooks.hook import Hook
from journal.repositories.entries import Entries
from journal.repositories.environments import Environments


class Receiver:
    """Records a hook as an entry, tells the bus, and folds what the listeners say into one decision for the agent."""

    def __init__(self, environments: Environments, entries: Entries, bus: Bus) -> None: ...

    def receive(self, hook: Hook) -> Decision: ...
