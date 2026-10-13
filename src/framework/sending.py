from dataclasses import dataclass, replace
from typing import Callable

from events.agents import AgentReported
from events.agents import ClockTicked
from declaring import trigger
from framework import actions
from events import Fact
from framework.parts import ANY_BUT_POST_TOOL_USE, Context
from receiving import Handler as Engines
from serving import Adapted as TheRecord


@dataclass(frozen=True)
class Sent:
    key: str
    values: dict


@dataclass(frozen=True)
class Nudge:
    line: str
    behaviour: str
    about: Callable
    guarantee: str = ""
    """What this nudge promises, in the words the user reads on the Settings page: when it is sent, and what the agent is told. The line itself is written for the agent and says it in the agent's words."""
    private: bool = True
    pace: Callable | None = None
    once: bool = False
    most: int = 0
    first: bool = False
    timing: trigger.Trigger = trigger.NEVER
    action: str = actions.SAY
    expects: tuple = ()
    """What the nudge promises, played and watched like any registration's: a Given on the clock or on a tool's use, and the nudge it sends."""

    def __post_init__(self) -> None:
        if self.first and not self.most:
            raise ValueError(f"nudge {self.line} offers the first row under a cap, so it needs most")

    def describe(self) -> dict:
        """What the viewer needs to show a nudge beside the switch that governs it: the behaviour that switches it, and its own cadence when it does not take that behaviour's."""
        return {"behaviour": self.behaviour, "guarantee": self.guarantee, "timing": self.timing.described(), "once": self.once, "most": self.most}

    def cadence(self, context) -> trigger.Trigger:
        cadence = self.timing or context.feature.cadence(context.record, self.behaviour)
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
            actions.perform(speaking, speaking.agent.row, nudge.action, nudge.line, nudge.private, **found.values)


class SendOnTheClock(Engines[ClockTicked]):
    """The engine's own sender of a feature's declared nudges, on the clock."""

    owes = False

    def __init__(self, feature, nudges: tuple):
        self.feature, self.nudges = feature, nudges

    def handle(self, event: ClockTicked, record: TheRecord) -> list[Fact]:
        send(Context.of(self.feature, record), self.nudges)
        return []


class SendOnToolUse(Engines[AgentReported]):
    """The engine's own sender of a feature's declared nudges, as the agent uses a tool, but for the report after one."""

    owes = False

    def __init__(self, feature, nudges: tuple):
        self.feature, self.nudges = feature, nudges

    def handle(self, event: AgentReported, record: TheRecord) -> list[Fact]:
        if event.hook in ANY_BUT_POST_TOOL_USE:
            send(Context.of(self.feature, record), self.nudges)
        return []
