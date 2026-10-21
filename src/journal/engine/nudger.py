from journal.engine.clock import Clock
from journal.engine.nudge_registry import NudgeRegistry
from journal.events.agent.line_delivered import LineDelivered
from journal.events.bus import Bus
from journal.support.listener_queue import ListenerQueue
from journal.support.feature_registry import FeatureRegistry
from journal.engine.nudge import Nudge
from journal.support.actor import Actor
from journal.models.agent import Agent
from journal.models.entry import Entry
from journal.repositories.entries import Entries
from journal.support.scope import Scope

NUDGE = "nudge"


class Nudger:
    """Says a line to an agent, in the agent's environment: drops it when its feature is off or it was nudge lately, writes the entry, tells the bus a line was nudge once the reply has gone, and hands back the words; a refusal's line is said and recorded the same but never dropped for having been said lately, since a hold stands as long as its reason does. The caller picks the road: a hook's answer, or the supervisor."""

    def __init__(self, features: FeatureRegistry, entries: Entries, scope: Scope, bus: Bus, deferred: ListenerQueue, clock: Clock, registry: NudgeRegistry) -> None:
        self.features, self.entries, self.scope, self.bus, self.deferred, self.clock = features, entries, scope, bus, deferred, clock
        self.registry = registry

    def is_silenced(self, nudge: Nudge) -> bool:
        return self.features.silenced(nudge)

    def deliver(self, agent: Agent, nudge: Nudge) -> str | None:
        with self.scope.environment(agent.environment_id):
            return self._line_record(agent, nudge, repeated=True)

    def refuse_with(self, agent: Agent, nudge: Nudge) -> str | None:
        with self.scope.environment(agent.environment_id):
            return self._line_record(agent, nudge, repeated=False)

    def _line_record(self, agent: Agent, nudge: Nudge, repeated: bool) -> str | None:
        self.registry.lookup(nudge.key)
        if self.features.silenced(nudge) or repeated and self._repeat(agent, nudge):
            return None
        line = nudge.rendered()
        self.entries.save(Entry(environment_id=agent.environment_id, kind=NUDGE, actor=Actor.system(), data={"key": nudge.key, "session": agent.session, "line": line, "time": self.clock.time(), "tool_use": agent.tool_uses}), Actor.system())
        event = LineDelivered(nudge=nudge.key, values=dict(nudge.values)).placed(agent.session, agent.environment_id, agent.provider, None, self.clock.time())
        self.deferred.add(lambda: self.bus.dispatch(event))
        return line

    def _repeat(self, agent: Agent, nudge: Nudge) -> bool:
        if not nudge.repeat_after:
            return False
        last = self.entries.last_lines(agent.session, nudge.key) if nudge.held_whatever_its_values else self.entries.last_line(agent.session, nudge.key, nudge.rendered())
        return last > self.clock.time() - nudge.repeat_after
