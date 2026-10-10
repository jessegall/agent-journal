import time
from dataclasses import asdict, dataclass, replace
from typing import ClassVar

from controllers.types import Agents, Nudges
from features import FEATURES
from engine.events.engine import ClockTicked
from engine.events.resources import AnyEvent, ResourceEvent
from resources.fields import Loaded
from features.journal import waiting
from features.parts import AgentContext, Context, Handler
from features.trigger import MINUTE
from resources.types import Nudge

STANDING = "standing"
KEPT = 20
GONE = ("completed", "deleted")
CHANGES = ("created", "updated", *GONE)


@dataclass(frozen=True)
class NudgeCreated(ResourceEvent):
    on: ClassVar[str] = "nudge.created"


@dataclass(frozen=True)
class RowChanged(AnyEvent):
    def wanted(self) -> bool:
        return self.action in CHANGES


@dataclass(frozen=True)
class Standing(Loaded):
    """A line that asked the agent to act and has not been acted on."""
    n: int = 0
    asks: str = ""
    until: tuple[str, ...] = ()
    rows: tuple[str, ...] = ()
    session: str = ""
    at: float = 0.0

    @classmethod
    def of(cls, nudge: Nudge) -> "Standing":
        return cls(n=nudge.n, asks=nudge.asks, until=tuple(nudge.until), rows=tuple(map(str, nudge.data.get("rows") or ())),
                   session=nudge.session, at=nudge.created)

    @property
    def feature(self) -> str:
        return self.asks.partition(".")[0]

    @property
    def line(self) -> str:
        return self.asks.partition(".")[2]

    def is_replaced_by(self, newer: "Standing") -> bool:
        return newer.asks == self.asks and (newer.rows == self.rows or bool(set(newer.rows) & set(self.rows)))

    def is_answered_by(self, event: ResourceEvent) -> bool:
        if f"{event.type}.{event.action}" not in self.until:
            return False
        named = self.named(event.type)
        return not named or f"{event.type}:{event.n}" in named

    def named(self, kind: str) -> list[str]:
        return [ref for ref in self.rows if ref.startswith(f"{kind}:")]

    def struck(self, event: ResourceEvent) -> "Standing":
        return replace(self, rows=tuple(ref for ref in self.rows if ref != f"{event.type}:{event.n}"))

    def is_due(self, every: float) -> bool:
        return time.time() - self.at >= every

    def is_owed(self, record) -> bool:
        return self.feature in FEATURES and FEATURES[self.feature].is_owed(record, self.line, self.rows)


def standing(context: Context) -> list[Standing]:
    return [Standing.from_json(raw) for raw in context.record.state(context.feature.name).get(STANDING, {}).values()]


def keep(context: Context, kept: list[Standing]) -> None:
    context.record.state(context.feature.name).set(STANDING, {str(s.n): asdict(s) for s in kept[-KEPT:]})


def still_open(nudges: Nudges) -> set[int]:
    return {row["n"] for row in nudges.rows.summaries() if not row["completed"] and not row["deleted"]}


def close(context: Context, closed: list[Standing], how: str) -> None:
    nudges = context.journal.get(Nudges)
    standing_rows = still_open(nudges)
    for s in [s for s in closed if s.n in standing_rows]:
        nudges.settle(s.n, how=how)


class StandUntilAnswered(Handler):
    def handle(self, context: Context, event: NudgeCreated) -> None:
        nudge = context.journal.get(Nudges).load(event.n)
        if not nudge.until:
            return
        made, before = Standing.of(nudge), standing(context)
        replaced = [s for s in before if s.is_replaced_by(made)]
        keep(context, [*(s for s in before if s not in replaced), made])
        close(context, replaced, f"replaced by nudge {made.n}")


class ClearWhenAnswered(Handler):
    def handle(self, context: Context, event: RowChanged) -> None:
        before = standing(context)
        if event.type == Nudge.type:
            if event.action in GONE:
                keep(context, [s for s in before if s.n != event.n])
            return
        touched = [s for s in before if s.is_answered_by(event)]
        if not touched:
            return
        narrowed = {s.n: s.struck(event) for s in touched}
        answered = [s for s in touched if not narrowed[s.n].named(event.type)]
        keep(context, [narrowed.get(s.n, s) for s in before if s not in answered])
        close(context, answered, f"answered by {event.type} {event.n}, {event.action}")


class AskAgain(Handler):
    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        before = standing(context)
        primary = context.journal.get(Agents).primary_to_read()
        if not before or not primary or primary.n != context.agent.row.n:
            return
        nudges = context.journal.get(Nudges)
        standing_rows = still_open(nudges)
        elsewhere = [s for s in before if s.session != primary.title]
        gone = [s for s in before if s not in elsewhere and not s.is_owed(context.record)]
        kept = [s for s in before if s.n in standing_rows and s not in elsewhere and s not in gone]
        if len(kept) < len(before):
            keep(context, kept)
            close(context, elsewhere, "said to a session that is no longer the agent's")
            close(context, gone, "what it asked about is gone")
        every = float(context.settings.every) * MINUTE
        if not every or waiting(context.record, primary):
            return
        for s in [s for s in kept if s.is_due(every)]:
            asked = nudges.load(s.n)
            nudges.create(asked.title, abstract=asked.abstract, brief=asked.brief, **{**asked.data, "rows": list(s.rows)})
