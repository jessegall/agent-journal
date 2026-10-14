from journal.features.registry import Registry
from journal.features.said import Said
from journal.models.agent import Agent
from journal.repositories.entries import Entries
from journal.supervisor_link import SupervisorLink


class Nudger:
    """Says a line to an agent: drops it when its feature is off or it was said lately, writes the entry, and picks the road. In a hook's answer when one is being written; typed in through the supervisor otherwise."""

    def __init__(self, registry: Registry, entries: Entries, supervisor: SupervisorLink) -> None: ...

    def say(self, agent: Agent, said: Said) -> str | None:
        """The rendered line when it goes out, None when it is dropped."""
        ...

    def type_in(self, agent: Agent, said: Said) -> None: ...

    def _repeat(self, agent: Agent, said: Said) -> bool: ...
