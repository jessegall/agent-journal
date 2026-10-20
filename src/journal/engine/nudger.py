from journal.engine.clock import Clock
from journal.engine.nudge_registry import NudgeRegistry
from journal.events.agent.line_said import LineSaid
from journal.events.bus import Bus
from journal.support.deferred import Deferred
from journal.support.features_known import FeaturesKnown
from journal.support.nudge import Said
from journal.support.actor import Actor
from journal.models.agent import Agent
from journal.models.entry import Entry
from journal.repositories.entries import Entries
from journal.support.scope import Scope

NUDGE = "nudge"


class Nudger:
    """Says a line to an agent, in the agent's environment: drops it when its feature is off or it was nudge lately, writes the entry, tells the bus a line was nudge once the reply has gone, and hands back the words. The caller picks the road: a hook's answer, or the supervisor."""

    def __init__(self, features: FeaturesKnown, entries: Entries, scope: Scope, bus: Bus, deferred: Deferred, clock: Clock, registry: NudgeRegistry) -> None:
        self.features, self.entries, self.scope, self.bus, self.deferred, self.clock = features, entries, scope, bus, deferred, clock
        self.registry = registry

    def say(self, agent: Agent, nudge: Said) -> str | None:
        with self.scope.of(agent.environment_id):
            return self._said(agent, nudge)

    def _said(self, agent: Agent, nudge: Said) -> str | None:
        self.registry.named(nudge.key)
        if self.features.silenced(nudge) or self._repeat(agent, nudge):
            return None
        line = nudge.rendered()
        self.entries.save(Entry(environment_id=agent.environment_id, kind=NUDGE, actor=Actor.system(), data={"key": nudge.key, "session": agent.session, "line": line, "at": self.clock.now()}), Actor.system())
        event = LineSaid(nudge=nudge.key).placed(agent.session, agent.environment_id, agent.provider, None, self.clock.now())
        self.deferred.add(lambda: self.bus.dispatch(event))
        return line

    def _repeat(self, agent: Agent, nudge: Said) -> bool:
        if not nudge.repeat_after:
            return False
        last = self.entries.last_said_of(agent.session, nudge.key) if nudge.held_whatever_its_values else self.entries.last_said(agent.session, nudge.key, nudge.rendered())
        return last > self.clock.now() - nudge.repeat_after
