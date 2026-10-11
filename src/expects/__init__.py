"""The words an expectation is written in: a Given, the arrow, and the outcomes it must produce.

The grammar is doc 80's chapter 'The expects grammar'; this module is the vocabulary it names.
The Fakes that answer each service, and the run that plays an expectation, arrive with phase 2.
"""

from dataclasses import dataclass, field
from typing import Any, Mapping


class NotAnOutcome(TypeError):
    @classmethod
    def joined(cls, value) -> "NotAnOutcome":
        return cls(f"an expectation is joined with outcomes, not with {type(value).__name__}")


class NoSuchService(LookupError):
    @classmethod
    def named(cls, name: str) -> "NoSuchService":
        return cls(f"{name!r} is not a service an expectation can answer for; it is one of {', '.join(SERVICES)}")


__all__ = ("Given", "Expectation", "Outcome", "Outcomes", "SERVICES",
           "Dispatches", "Wrote", "Updated", "Printed", "Ran", "Refused", "Changed", "Kept", "Unchanged",
           "Formats", "Nudged", "Held", "Answered",
           "Nothing", "nothing", "At", "at", "Counting", "counting", "Answering", "answering", "Exited", "exited",
           "NotAnOutcome", "NoSuchService")
"""The whole vocabulary, so a word in doc 80's grammar and a word here cannot drift apart."""

SERVICES = ("rows", "chat", "files", "processes", "providers", "settings", "clock", "ids", "commands")
"""Every service a registration may reach. A Given names the ones it answers for; anything else is unreachable."""


class Outcome:
    """One thing a registration must produce. Outcomes join with & and all of them must hold."""

    def __and__(self, other) -> "Outcomes":
        return Outcomes((self,)) & other

    def holds(self, seen) -> str:
        """Empty when this outcome holds of the play, else what the play did instead. Each word reads the play itself, so no checker has to know them all."""
        raise NotImplementedError


@dataclass(frozen=True)
class Outcomes:
    each: tuple[Outcome, ...] = ()

    @classmethod
    def of(cls, outcomes) -> "Outcomes":
        if isinstance(outcomes, Outcomes):
            return outcomes
        if isinstance(outcomes, Outcome):
            return cls((outcomes,))
        raise NotAnOutcome.joined(outcomes)

    def __and__(self, other) -> "Outcomes":
        return Outcomes(self.each + Outcomes.of(other).each)


@dataclass(frozen=True)
class Nothing:
    """What Dispatches(nothing) names: the registration dispatched no fact at all."""


nothing = Nothing()


@dataclass(frozen=True)
class Dispatches(Outcome):
    """A fact was dispatched, with those field values; claimed names the key the engine claimed for it."""

    fact: Any
    claimed: str = ""
    def holds(self, seen) -> str:
        if isinstance(self.fact, Nothing):
            return "" if not seen.facts else f"it dispatched {[type(one).__name__ for one in seen.facts]}, and the expectation says it dispatches nothing"
        for one in seen.facts:
            if one == self.fact and (not self.claimed or getattr(one, "claim", "") == self.claimed):
                return ""
        return f"it did not dispatch {self.fact!r}; it dispatched {seen.facts!r}"


@dataclass(frozen=True)
class Wrote(Outcome):
    row: Any
    def holds(self, seen) -> str:
        return "" if self.row in seen.wrote else f"it did not write {self.row!r}; it wrote {seen.wrote!r}"


@dataclass(frozen=True, init=False)
class Updated(Outcome):
    """An existing row was changed, and only in the fields named."""

    row: Any
    changed: tuple[tuple[str, Any], ...]

    def __init__(self, row, **changed) -> None:
        object.__setattr__(self, "row", row)
        object.__setattr__(self, "changed", tuple(sorted(changed.items())))
    def holds(self, seen) -> str:
        return "" if (self.row, self.changed) in seen.updated else f"it did not change {self.row!r} in {dict(self.changed)}; it changed {seen.updated!r}"


@dataclass(frozen=True)
class Printed(Outcome):
    text: str
    def holds(self, seen) -> str:
        return "" if self.text in seen.said else f"it did not say {self.text!r}; it said {seen.said!r}"


@dataclass(frozen=True)
class Ran(Outcome):
    argv: tuple[str, ...]
    def holds(self, seen) -> str:
        return "" if self.argv in seen.ran else f"it did not run {self.argv!r}; it ran {seen.ran!r}"


@dataclass(frozen=True)
class Refused(Outcome):
    why: str
    def holds(self, seen) -> str:
        return "" if seen.refused == self.why else f"it refused with {seen.refused!r}, not with {self.why!r}"


@dataclass(frozen=True)
class Changed(Outcome):
    """What a handler on a mutable answer turned its text into."""

    text: str
    def holds(self, seen) -> str:
        return "" if seen.changed == self.text else f"it changed the text to {seen.changed!r}, not to {self.text!r}"


@dataclass(frozen=True)
class Kept(Outcome):
    """It refused, changed and stopped nothing: what it was handed goes on unchanged."""
    def holds(self, seen) -> str:
        return "" if seen.refused is None and seen.changed is None else f"it did not let it through: it refused {seen.refused!r} and changed {seen.changed!r}"


@dataclass(frozen=True)
class Unchanged(Outcome):
    """Nothing in the world changed: no row, no file, no setting. What a read-only listener owes."""
    def holds(self, seen) -> str:
        return "" if seen.is_unchanged else f"it changed the world: wrote {seen.wrote!r} and changed {seen.updated!r}"


@dataclass(frozen=True)
class Formats(Outcome):
    """A formatter is a pure function, so its Given and its outcome are one word."""

    text: str
    to: str = ""
    def holds(self, seen) -> str:
        return "" if seen.changed == self.to else f"it formatted {self.text!r} as {seen.changed!r}, not as {self.to!r}"


@dataclass(frozen=True, init=False)
class Nudged(Outcome):
    """That nudge line was sent, with those values filled in. The line is named by its key, never by its wording."""

    line: str
    values: tuple[tuple[str, Any], ...]

    def __init__(self, line: str, **values) -> None:
        object.__setattr__(self, "line", line)
        object.__setattr__(self, "values", tuple(sorted(values.items())))
    def holds(self, seen) -> str:
        return "" if (self.line, self.values) in seen.nudged else f"it did not nudge {self.line!r} with {dict(self.values)}; it nudged {seen.nudged!r}"


@dataclass(frozen=True)
class Held(Outcome):
    why: str
    def holds(self, seen) -> str:
        return "" if seen.held == self.why else f"it held the writes with {seen.held!r}, not with {self.why!r}"


@dataclass(frozen=True)
class Answered(Outcome):
    """The reduced answer to a request, not one answerer's part."""

    answer: Any
    def holds(self, seen) -> str:
        return "" if seen.answered == self.answer else f"it answered {seen.answered!r}, not {self.answer!r}"


@dataclass(frozen=True)
class At:
    """The time the Clock service answers, fixed."""

    seconds: float


@dataclass(frozen=True)
class Counting:
    """The Ids service answers from this number upwards."""

    first: int = 1


@dataclass(frozen=True)
class Answering:
    """What a service gives back: a mapping from what the code asks to its answer. An ask it does not name is a failure naming the ask."""

    answers: Mapping[Any, Any]


@dataclass(frozen=True)
class Exited:
    """How a command the registration ran came back."""

    code: int
    output: str = ""


def at(seconds: float) -> At:
    return At(float(seconds))


def counting(first: int = 1) -> Counting:
    return Counting(first)


def answering(answers: Mapping[Any, Any]) -> Answering:
    return Answering(answers)


def exited(code: int, output: str = "") -> Exited:
    return Exited(code, output)


@dataclass(frozen=True)
class Given:
    """Everything the registration may read. What a Given does not state is unreachable, so an expectation is exact."""

    on: Any
    rows: tuple = ()
    settings: Mapping[str, Any] = field(default_factory=dict)
    clock: At = At(0.0)
    ids: Counting = Counting()
    chat: Answering = Answering({})
    commands: Answering = Answering({})
    files: Answering = Answering({})
    processes: Answering = Answering({})
    providers: Answering = Answering({})

    def __rshift__(self, outcomes) -> "Expectation":
        return Expectation(self, Outcomes.of(outcomes))


@dataclass(frozen=True)
class Expectation:
    given: Given
    outcomes: Outcomes

    def __and__(self, other) -> "Expectation":
        """`>>` binds tighter than `&`, so the outcomes after the first one are joined onto the expectation itself."""
        return Expectation(self.given, self.outcomes & other)
