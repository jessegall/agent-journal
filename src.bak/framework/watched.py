import time
from dataclasses import dataclass
from typing import Callable

from resources.extension import Extension
from resources.memo import Memo
from engine.record import Record
from declaring.details import PLACEHOLDER
from framework.sending import Sent
from declaring.trigger import MINUTE
from resources.base import Refused
from resources.types import TYPES

MINUTES, PERCENT, COUNT = "minutes", "percent", "count"
MOST_NAMED = 10
FOUND = Memo(limit=256)


class NotAFact(Refused):
    @classmethod
    def named(cls, name: str) -> "NotAFact":
        return cls(f"{name!r} is not a fact a trigger can watch: write it as type.state.clock, like message.unread.created, or as a named fact, like agent.idle")


class UnknownFact(Refused, LookupError):
    @classmethod
    def named(cls, name: str, held: list[str]) -> "UnknownFact":
        return cls(f"a trigger on the journal's state watches one of {', '.join(held)}, not {name!r}: journal trigger facts lists them")


class ClaimedTwice(ValueError):
    @classmethod
    def named(cls, name: str) -> "ClaimedTwice":
        return cls(f"the fact {name} is declared twice; one feature owns each fact")


class UndeclaredState(ValueError):
    @classmethod
    def of(cls, type_: str, state: str) -> "UndeclaredState":
        return cls(f"{type_} declares no watchable state {state!r}; add it to the type's states first")


@dataclass(frozen=True)
class Watched:
    """What a trigger on the journal's state watches: a type, a state of its rows, the clock that times it (empty for a named fact) and the threshold."""

    type: str
    state: str
    clock: str
    over: float

    @classmethod
    def parse(cls, name: str, over: float) -> "Watched":
        parts = str(name).split(".")
        if not 2 <= len(parts) <= 3 or not all(parts):
            raise NotAFact.named(name)
        return cls(parts[0], parts[1], parts[2] if len(parts) == 3 else "", float(over))

    @classmethod
    def of(cls, trigger) -> "Watched":
        return cls.parse(trigger.fact, trigger.over)

    @property
    def name(self) -> str:
        return ".".join(part for part in (self.type, self.state, self.clock) if part)


@dataclass(frozen=True)
class Fact:
    name: str
    unit: str
    label: str
    phrase: str
    find: Callable
    fills: tuple[str, ...] = ("n", "title")
    """The placeholders this fact's own finder puts in what it sends, so a trigger can only write the ones it will be given."""

    def sentence(self, over: float) -> str:
        return self.phrase.format(over=int(over))

    def unfillable(self, text: str) -> list[str]:
        """The placeholders in a wording this fact never supplies. Left in, each one reaches the agent as its own braces, for good and without a word."""
        return sorted({found.group(1) for found in PLACEHOLDER.finditer(text)} - set(self.fills))


class FactRegistry:
    """Every fact a trigger can watch, each declared once by the feature that knows how to find its rows; a feature that is off takes its facts with it."""

    def __init__(self):
        self.facts = Extension()

    def register(self, owner, *facts: Fact) -> None:
        for fact in facts:
            if any(entry.key == fact.name for entry in self.facts.entries):
                raise ClaimedTwice.named(fact.name)
            self.facts.add(owner, fact, key=fact.name)

    def holds(self, watched: Watched, record: Record) -> bool:
        return bool(self.facts.each(record, key=watched.name))

    def get(self, watched: Watched, record: Record) -> Fact:
        if not self.holds(watched, record):
            raise UnknownFact.named(watched.name, self.names(record))
        return self.facts.each(record, key=watched.name)[0]

    def names(self, record: Record) -> list[str]:
        return list(self.facts.keyed(record))

    def each(self, record: Record) -> list[Fact]:
        return self.facts.each(record)


FACTS = FactRegistry()


def state_facts(type_: str, state: str, rows: Callable) -> list[Fact]:
    """One fact for each clock the type declares, all finding their rows in this state: a message unread since it was written, work open since its last log entry."""
    resource = TYPES[type_]
    if state not in resource.states:
        raise UndeclaredState.of(type_, state)
    told = resource.states[state]
    return [Fact(f"{type_}.{state}.{clock}", MINUTES, f"{told[0].upper()}{told[1:]} {timed}", f"{told} for more than {{over}} minutes {timed}",
                 lambda context, agent, over, clock=clock: aged(rows(context), lambda row: getattr(row, clock) or row.created, over),
                 fills=("n", "title", MINUTES))
            for clock, timed in resource.clocks.items()]


def filled(text: str, values: dict) -> str:
    return PLACEHOLDER.sub(lambda found: str(values.get(found.group(1), found.group(0))), text)


def minutes_since(stamp: float) -> int:
    return int((time.time() - stamp) / MINUTE)


def aged(rows: list, since: Callable, over: float) -> list[Sent]:
    """The rows older than the threshold, the oldest first."""
    ages = sorted(((minutes_since(since(row)), row) for row in rows), key=lambda pair: -pair[0])
    return [Sent(str(row.n), {"n": row.n, "title": row.title, "minutes": minutes}) for minutes, row in ages if minutes > over]


def found(watched: Watched, context, agent) -> list[Sent]:
    """What the fact names now: at most MOST_NAMED rows each time it is read, so a fact over many rows never writes a nudge for each of them in one hook."""
    fact = FACTS.get(watched, context.record)
    if context.hook is None:
        return fact.find(context, agent, watched.over)[:MOST_NAMED]
    return FOUND.get((str(context.record.root), context.record.env, watched, id(context.hook)), context.hook, lambda: fact.find(context, agent, watched.over)[:MOST_NAMED])
