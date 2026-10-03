import hashlib
from dataclasses import dataclass, replace
from typing import Callable

from engine.events.agents import AgentReported
from engine.events.engine import ClockTicked
from features import trigger
from features.parts import AgentContext, Handler

MINUTE = 60.0


@dataclass(frozen=True)
class Sent:
    key: str
    values: dict


@dataclass(frozen=True)
class Nudge:
    line: str
    behaviour: str
    about: Callable
    private: bool = True
    pace: Callable | None = None

    def cadence(self, context) -> trigger.Trigger:
        spec = context.feature.cadence(context.record, self.behaviour)
        return spec if self.pace is None else replace(spec, every=self.pace(context))

    def due(self, context, agent) -> list[Sent]:
        if not context.feature.on(context.record, self.behaviour):
            return []
        spec = self.cadence(context)
        due = [found for found in self.about(context, agent) if trigger.due(context.record, agent, self.named(context, found), spec)]
        for found in due:
            trigger.fired(context.record, agent, self.named(context, found))
        return due

    def named(self, context, found: Sent) -> str:
        return f"{context.feature.keyed(self.behaviour)}.{hashlib.sha1(found.key.encode()).hexdigest()[:12]}"


def send(context, nudges: tuple) -> None:
    agent = context.journal.agents.primary()
    if not agent:
        return
    speaking = context.speaking_to(agent)
    for nudge in nudges:
        for found in nudge.due(context, agent):
            speaking.agent.say(nudge.line, private=nudge.private, **found.values)


@dataclass
class SendOnTheClock(Handler):
    nudges: tuple

    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        send(context, self.nudges)


@dataclass
class SendOnToolUse(Handler):
    nudges: tuple

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        send(context, self.nudges)
