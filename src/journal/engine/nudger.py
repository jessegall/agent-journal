import time

from journal.support.features_known import FeaturesKnown
from journal.support.said import Said
from journal.support.actor import Actor
from journal.models.agent import Agent
from journal.models.entry import Entry
from journal.repositories.entries import Entries
from journal.support.scope import Scope

NUDGE = "nudge"


class Nudger:
    """Says a line to an agent, in the agent's environment: drops it when its feature is off or it was said lately, writes the entry, and hands back the words. The caller picks the road: a hook's answer, or the supervisor."""

    def __init__(self, features: FeaturesKnown, entries: Entries, scope: Scope) -> None:
        self.features, self.entries, self.scope = features, entries, scope

    def say(self, agent: Agent, said: Said) -> str | None:
        """The rendered line when it goes out, None when it is dropped."""
        with self.scope.of(agent.environment_id):
            return self._said(agent, said)

    def _said(self, agent: Agent, said: Said) -> str | None:
        if self.features.silenced(said) or self._repeat(agent, said):
            return None
        line = said.rendered()
        self.entries.save(Entry(environment_id=agent.environment_id, kind=NUDGE, actor=Actor.system(), data={"key": said.key, "session": agent.session, "line": line, "at": time.time()}), Actor.system())
        return line

    def _repeat(self, agent: Agent, said: Said) -> bool:
        """The same words to the same agent within the window: not again."""
        if not said.repeat_after:
            return False
        return self.entries.last_said(agent.session, said.key, said.rendered()) > time.time() - said.repeat_after
