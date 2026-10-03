import time
from dataclasses import dataclass
from typing import Callable

from engine.events.agents import AgentReported
from engine.events.engine import ClockTicked
from features.parts import AgentContext, Handler

MINUTE, HOUR = 60.0, 3600.0
SENT = "nudges"


@dataclass(frozen=True)
class Sent:
    key: str
    values: dict


@dataclass(frozen=True)
class Nudge:
    line: str
    every: str
    about: Callable
    unit: float = MINUTE

    def due(self, context, agent) -> list[Sent]:
        every, now = float(context.settings[self.every]) * self.unit, time.time()
        sent = context.record.state(SENT)
        due = [found for found in self.about(context, agent) if now - float(sent.get(self.named(context, found), 0)) >= every]
        for found in due:
            sent.set(self.named(context, found), now)
        return due

    def named(self, context, found: Sent) -> str:
        return f"{context.feature.name}.{self.line}.{found.key}"


def send(context, nudges: tuple) -> None:
    agent = context.journal.agents.primary()
    if not agent:
        return
    speaking = context.speaking_to(agent)
    for nudge in nudges:
        for found in nudge.due(context, agent):
            speaking.agent.whisper(nudge.line, **found.values)


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
