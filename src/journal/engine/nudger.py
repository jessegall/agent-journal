import time

from journal.events.agent.line_said import LineSaid
from journal.events.bus import Bus
from journal.support.deferred import Deferred
from journal.support.features_known import FeaturesKnown
from journal.support.said import Said
from journal.support.actor import Actor
from journal.models.agent import Agent
from journal.models.entry import Entry
from journal.repositories.entries import Entries
from journal.support.scope import Scope

NUDGE = "nudge"


class Nudger:
    """Says a line to an agent, in the agent's environment: drops it when its feature is off or it was said lately, writes the entry, tells the bus a line was said once the reply has gone, and hands back the words. The caller picks the road: a hook's answer, or the supervisor."""

    def __init__(self, features: FeaturesKnown, entries: Entries, scope: Scope, bus: Bus, deferred: Deferred) -> None:
        self.features, self.entries, self.scope, self.bus, self.deferred = features, entries, scope, bus, deferred

    def say(self, agent: Agent, said: Said) -> str | None:
        """The rendered line when it goes out, None when it is dropped."""
        with self.scope.of(agent.environment_id):
            return self._said(agent, said)

    def _said(self, agent: Agent, said: Said) -> str | None:
        if self.features.silenced(said) or self._repeat(agent, said):
            return None
        line = said.rendered()
        self.entries.save(Entry(environment_id=agent.environment_id, kind=NUDGE, actor=Actor.system(), data={"key": said.key, "session": agent.session, "line": line, "at": time.time()}), Actor.system())
        said_now = LineSaid(nudge=said.key).placed(agent.session, agent.environment_id, agent.provider, None)
        self.deferred.add(lambda: self.bus.dispatch(said_now))
        return line

    def _repeat(self, agent: Agent, said: Said) -> bool:
        """The same words to the same agent within the window, or the same line whatever its values when it is held so: not again."""
        if not said.repeat_after:
            return False
        last = self.entries.last_said_of(agent.session, said.key) if said.held_whatever_its_values else self.entries.last_said(agent.session, said.key, said.rendered())
        return last > time.time() - said.repeat_after
