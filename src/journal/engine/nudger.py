import time

from journal.features.registry import Registry
from journal.features.said import Said
from journal.models.actor import Actor
from journal.models.agent import Agent
from journal.models.entry import Entry
from journal.repositories.entries import Entries

NUDGE = "nudge"


class Nudger:
    """Says a line to an agent: drops it when its feature is off or it was said lately, writes the entry, and hands back the words. The caller picks the road: a hook's answer, or the supervisor."""

    def __init__(self, registry: Registry, entries: Entries) -> None:
        self.registry, self.entries = registry, entries

    def say(self, agent: Agent, said: Said) -> str | None:
        """The rendered line when it goes out, None when it is dropped."""
        if self.registry.silenced(said, agent.environment_id) or self._repeat(agent, said):
            return None
        line = said.rendered()
        self.entries.save(Entry(environment_id=agent.environment_id, kind=NUDGE, actor=Actor.system(), data={"key": said.key, "session": agent.session, "line": line, "at": time.time()}), Actor.system())
        return line

    def _repeat(self, agent: Agent, said: Said) -> bool:
        if not said.repeat_after:
            return False
        since = time.time() - said.repeat_after
        return any(e.data["session"] == agent.session and e.data["key"] == said.key and e.data["at"] > since for e in self.entries.of_kind(agent.environment_id, NUDGE))
