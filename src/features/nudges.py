from dataclasses import dataclass, replace
from typing import Callable

from engine.events.agents import AgentReported
from engine.events.engine import ClockTicked
from features import trigger
from features.parts import AgentContext, Handler


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
    first: bool = False

    def __post_init__(self) -> None:
        if self.first and not self.most:
            raise ValueError(f"nudge {self.line} offers the first row under a cap, so it needs most")

    def cadence(self, context) -> trigger.Trigger:
        cadence = context.feature.cadence(context.record, self.behaviour)
        return cadence if self.pace is None else replace(cadence, every=self.pace(context))

    def due(self, context, agent) -> list[Sent]:
        if not context.feature.on(context.record, self.behaviour):
            return []
        if self.once:
            return [found for found in self.about(context, agent) if context.once(self.line, found.key)]
        cadence = self.cadence(context)
        found = self.about(context, agent)
        if self.first:
            found = [one for one in found if not context.used_up(self.line, one.key, self.most)][:1]
        due = [one for one in found if context.every(self.behaviour, f"{self.line}:{one.key}", cadence)]
        return self.capped(context, due) if self.most and due else due

    def capped(self, context, due: list[Sent]) -> list[Sent]:
        return [found for found in due if context.at_most(self.line, found.key, self.most)]


def send(context, nudges: tuple) -> None:
    speaking = context.to_primary()
    if not speaking:
        return
    for nudge in nudges:
        for found in nudge.due(speaking, speaking.agent.row):
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
