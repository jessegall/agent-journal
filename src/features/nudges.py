from dataclasses import dataclass, replace
from typing import Callable

from engine.events.agents import AgentReported
from engine.events.engine import ClockTicked
from features import trigger
from features.parts import AgentContext, Handler

MINUTE = 60.0
DAY = 24 * 60 * MINUTE


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
    once: bool = False
    most: int = 0

    def cadence(self, context) -> trigger.Trigger:
        spec = context.feature.cadence(context.record, self.behaviour)
        return spec if self.pace is None else replace(spec, every=self.pace(context))

    def due(self, context, agent) -> list[Sent]:
        if not context.feature.on(context.record, self.behaviour):
            return []
        if self.once:
            return [found for found in self.about(context, agent) if context.once(self.line, found.key)]
        spec = self.cadence(context)
        due = [found for found in self.about(context, agent) if context.every(self.behaviour, found.key, spec)]
        return self.capped(context, due) if self.most and due else due

    def capped(self, context, due: list[Sent]) -> list[Sent]:
        return [found for found in due if context.at_most(self.line, found.key, self.most)]


def send(context, nudges: tuple) -> None:
    agent = context.journal.agents.primary()
    if not agent:
        return
    speaking = context.speaking_to(agent)
    for nudge in nudges:
        for found in nudge.due(speaking, agent):
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
