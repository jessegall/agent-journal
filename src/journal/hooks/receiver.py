from journal.features.bus import Bus
from journal.hooks.decision import Decision
from journal.hooks.payload import Hook
from journal.repositories.environments import Environments
from journal.repositories.events import Events


class Receiver:
    """Records a hook as an event, lets the features speak, and answers the agent."""

    def __init__(self, environments: Environments, events: Events, bus: Bus) -> None: ...

    def receive(self, hook: Hook) -> Decision: ...
