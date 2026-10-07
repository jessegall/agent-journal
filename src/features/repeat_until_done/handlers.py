import time
from dataclasses import asdict, dataclass
from typing import ClassVar

from controllers.types import Nudges
from engine.events.engine import ClockTicked
from engine.events.resources import AnyEvent, ResourceEvent
from engine.fields import Loaded
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
    yields: bool = False
    at: float = 0.0

    @classmethod
    def of(cls, nudge: Nudge) -> "Standing":
        return cls(n=nudge.n, asks=nudge.asks, until=tuple(nudge.until), rows=tuple(map(str, nudge.data.get("rows") or ())),
                   session=nudge.session, yields=bool(nudge.data.get("yields")), at=nudge.created)

    @property
    def key(self) -> str:
        return " ".join((self.asks, *self.rows))

    def is_answered_by(self, event: ResourceEvent) -> bool:
        if f"{event.type}.{event.action}" not in self.until:
            return False
        named = [ref for ref in self.rows if ref.startswith(f"{event.type}:")]
        return not named or f"{event.type}:{event.n}" in named

    def is_due(self, every: float) -> bool:
        return time.time() - self.at >= every


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
        nudges.complete(s.n, how=how)


class StandUntilAnswered(Handler):
    def handle(self, context: Context, event: NudgeCreated) -> None:
        nudge = context.journal.get(Nudges).load(event.n)
        if not nudge.until:
            return
        made, before = Standing.of(nudge), standing(context)
        keep(context, [*(s for s in before if s.key != made.key), made])
        close(context, [s for s in before if s.key == made.key], f"replaced by nudge {made.n}")


class ClearWhenAnswered(Handler):
    def handle(self, context: Context, event: RowChanged) -> None:
        before = standing(context)
        if event.type == Nudge.type:
            if event.action in GONE:
                keep(context, [s for s in before if s.n != event.n])
            return
        answered = [s for s in before if s.is_answered_by(event)]
        if not answered:
            return
        keep(context, [s for s in before if s not in answered])
        close(context, answered, f"answered by {event.type} {event.n}, {event.action}")


class AskAgain(Handler):
    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        every, before = float(context.settings.every) * MINUTE, standing(context)
        if not before:
            return
        nudges = context.journal.get(Nudges)
        standing_rows = still_open(nudges)
        kept = [s for s in before if s.n in standing_rows]
        if len(kept) < len(before):
            keep(context, kept)
        due = [s for s in kept if s.session == context.agent.session and s.is_due(every)] if every else []
        if due and waiting(context.record, context.agent.row):
            due = [s for s in due if not s.yields]
        for s in due:
            asked = nudges.load(s.n)
            nudges.create(asked.title, abstract=asked.abstract, brief=asked.brief, **asked.data)
