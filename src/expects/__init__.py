"""The words an expectation is written in: a Given, the arrow, and the outcomes it must produce.

The grammar is doc 80's chapter 'The expects grammar'; this module is the vocabulary it names.
The Fakes that answer each service, and the run that plays an expectation, arrive with phase 2.
"""

from dataclasses import dataclass, field, fields

from resources.runs import Exited
from typing import Any, Mapping


class NotAnOutcome(TypeError):
    @classmethod
    def joined(cls, value) -> "NotAnOutcome":
        return cls(f"an expectation is joined with outcomes, not with {type(value).__name__}")


__all__ = ("Given", "Expectation", "Outcome", "Outcomes", "SERVICES",
           "Dispatches", "Wrote", "Removed", "File", "Left", "Hooked", "Updated", "Printed", "Ran", "Refused", "Changed", "Kept", "Unchanged",
           "Formats", "Nudged", "Held", "Answered", "Remembered", "Set", "Whispered",
           "Nothing", "nothing", "At", "at", "Counting", "counting", "Answering", "answering", "Exited", "exited",
           "NotAnOutcome")
"""The whole vocabulary, so a word in doc 80's grammar and a word here cannot drift apart."""

SERVICES = ("rows", "chat", "files", "processes", "providers", "settings", "clock", "ids", "commands", "git", "journal root", "viewer", "own work")
"""Every service a registration may reach. A Given names the ones it answers for; anything else is unreachable."""

def stated(row) -> dict:
    """What an expectation says about a row: the fields it set, and not the ones it left alone. A row's number, its timestamps and its empty fields are the play's business, not the promise's."""
    return {name: value for name, value in held(row).items() if value}


def held(row) -> dict:
    """What a row holds: its declared fields and the ones it keeps in data, flattened so an expectation names either kind the same way. Anything derived from them - a ref built out of a type and a number - is left out, because a promise is about what was written, not about what can be worked out from it."""
    own = {field.name: getattr(row, field.name) for field in fields(row)}
    return {**own, **(own.get("data") or {})}


def contains(got, want) -> bool:
    """Whether a value holds what was stated of it: a dict by the keys named, a list item by item, anything else exactly. What the journal fills in beside is never stated."""
    if isinstance(want, dict):
        return isinstance(got, dict) and all(key in got and contains(got[key], value) for key, value in want.items())
    if isinstance(want, (list, tuple)):
        return isinstance(got, (list, tuple)) and len(got) == len(want) and all(contains(one, other) for one, other in zip(got, want))
    return got == want


def matches(row, wanted: dict) -> bool:
    found = held(row)
    return all(name in found and contains(found[name], value) for name, value in wanted.items())


def named(row) -> str:
    return f"{type(row).__name__}({stated(row)})"


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
    claimed: str | None = None

    def holds(self, seen) -> str:
        if isinstance(self.fact, Nothing):
            return "" if not seen.facts else f"it dispatched {[type(one).__name__ for one in seen.facts]}, and the expectation says it dispatches nothing"
        for one in seen.facts:
            if one == self.fact and (self.claimed is None or getattr(one, "claim", "") == self.claimed):
                return ""
        return f"it did not dispatch {self.fact!r}; it dispatched {seen.facts!r}"


@dataclass(frozen=True)
class File:
    """A file under the project folder the play ran in. As a Given states it, it is a file that exists; as an outcome states it, the text is what the file must contain, never the whole file, and the mode is the permission bits it must carry, written as three or four digits."""

    path: str
    text: str = ""
    mode: str = ""


@dataclass(frozen=True)
class Left:
    """A file as the play left it: what it holds and the permission bits it carries."""

    text: str = ""
    mode: str = ""


@dataclass(frozen=True)
class Wrote(Outcome):
    row: Any
    def holds(self, seen) -> str:
        if isinstance(self.row, File):
            return self.file_holds(seen.files.get(self.row.path))
        wanted = stated(self.row)
        if any(isinstance(row, type(self.row)) and matches(row, wanted) for row in seen.wrote):
            return ""
        return f"it wrote no {type(self.row).__name__} holding {wanted}; it wrote {[named(one) for one in seen.wrote]}"

    def file_holds(self, found: Left | None) -> str:
        if found is None:
            return f"it left no file {self.row.path!r}"
        if self.row.text not in found.text:
            return f"the file {self.row.path!r} does not hold {self.row.text!r}; it holds {found.text[:200]!r}"
        if self.row.mode and self.row.mode != found.mode:
            return f"the file {self.row.path!r} is {found.mode}, not {self.row.mode}"
        return ""


@dataclass(frozen=True)
class Removed(Outcome):
    """A file is gone after the play: it is not under the project folder any more."""

    file: File

    def holds(self, seen) -> str:
        return "" if self.file.path not in seen.files else f"the file {self.file.path!r} is still there"


@dataclass(frozen=True, init=False)
class Updated(Outcome):
    """An existing row was changed and now holds what this says. It is read back from the record, so it asserts what the row IS, not what the write was called."""

    row: Any
    changed: tuple[tuple[str, Any], ...]

    def __init__(self, row, **changed) -> None:
        object.__setattr__(self, "row", row)
        object.__setattr__(self, "changed", tuple(sorted(changed.items())))

    def holds(self, seen) -> str:
        wanted = {**stated(self.row), **dict(self.changed)}
        for row in seen.updated:
            if isinstance(row, type(self.row)) and matches(row, wanted):
                return ""
        return f"it changed no {type(self.row).__name__} to hold {wanted}; it changed {[named(one) for one in seen.updated]}"


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
class Set(Outcome):
    """A setting the handler wrote, named as a Given names one: the feature, a dot and the key."""

    setting: str
    value: Any

    def holds(self, seen) -> str:
        if self.setting not in seen.settings:
            return f"it set no {self.setting}; the settings it left are {sorted(seen.settings)}"
        found = seen.settings[self.setting]
        return "" if found == self.value else f"it set {self.setting} to {found!r}, not to {self.value!r}"


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
    """A formatter is a pure function, so its Given and its outcome are one word: it reads as an expectation wherever one is wanted."""

    text: str
    to: str = ""

    @property
    def given(self) -> "Given":
        """The text it is handed is its whole world; a Given of its own would say nothing."""
        return Given(self.text)

    @property
    def outcomes(self) -> "Outcomes":
        return Outcomes((self,))
    def holds(self, seen) -> str:
        return "" if seen.changed == self.to else f"it formatted {self.text!r} as {seen.changed!r}, not as {self.to!r}"


@dataclass(frozen=True, init=False)
class Nudged(Outcome):
    """That nudge line was sent, and what it said carries these values. The line is named by its key, never by its wording, but the values are checked against the words the agent really heard."""

    line: str
    values: tuple[tuple[str, Any], ...]

    def __init__(self, line: str, **values) -> None:
        object.__setattr__(self, "line", line)
        object.__setattr__(self, "values", tuple(sorted(values.items())))

    def holds(self, seen) -> str:
        said = [one for one in seen.nudged if one[0] == self.line]
        if not said:
            return f"it did not nudge {self.line!r}; it nudged {[one[0] for one in seen.nudged] or 'nothing'}"
        for _, title, brief in said:
            if all(str(value) in f"{title} {brief}" for _, value in self.values):
                return ""
        return (f"it nudged {self.line!r}, but what it said carried none of {[str(v) for _, v in self.values]}: "
                f"{[f'{t} {b}'.strip() for _, t, b in said]}")


@dataclass(frozen=True)
class Whispered(Outcome):
    """That line reached the agent as a whisper, beside its turn, rather than as a line it must answer. Read from what the delivery really gave each channel, never from the message's own word for itself."""

    words: str

    def holds(self, seen) -> str:
        if any(self.words in one for one in seen.whispered):
            return ""
        if any(self.words in one for one in seen.typed):
            return f"it reached the agent as a line it must answer, not as a whisper: {seen.typed}"
        return f"nothing it whispered carried {self.words!r}; it whispered {seen.whispered or 'nothing'}"


@dataclass(frozen=True)
class Remembered(Outcome):
    """What a registration left in the journal's own memory rather than in a row: a claim it took, a count it raised, a mark that something was said. Read back from the state the feature owns, so it asserts what is really remembered."""

    key: str
    value: Any = None

    def holds(self, seen) -> str:
        if self.key not in seen.remembered:
            return f"it remembered nothing under {self.key!r}; it remembered {sorted(seen.remembered)}"
        if self.value is not None and seen.remembered[self.key] != self.value:
            return f"it remembered {seen.remembered[self.key]!r} under {self.key!r}, not {self.value!r}"
        return ""


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


WHEN = 1_767_225_600.0
"""The hour a Given is set at when it names no clock: a constant the run chooses, never the wall clock, so an expectation reads the same today and in a year."""


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


def at(seconds: float) -> At:
    return At(float(seconds))


def counting(first: int = 1) -> Counting:
    return Counting(first)


def answering(answers: Mapping[Any, Any]) -> Answering:
    return Answering(answers)


def exited(code: int, output: str = "") -> Exited:
    return Exited(code, output)


@dataclass(frozen=True)
class Hooked:
    """The hook call a registration is played under, as the engine's hook carries it: which moment of the tool's life it is, the folder the agent works in (a path under the project folder, empty for the project folder itself), the subagent it came from if any, and why a session began."""

    event: str = "PreToolUse"
    cwd: str = ""
    agent: str = ""
    source: str = ""


@dataclass(frozen=True)
class Given:
    """Everything the registration may read. What a Given does not state is unreachable, so an expectation is exact."""

    on: Any
    earlier: tuple = ()
    """What the registration was already given, in order, before the event in on: a hold is set by one event and let go by another, and a cadence says the second time nothing happens. The outcomes judge the world after all of them."""
    rows: tuple = ()
    settings: Mapping[str, Any] = field(default_factory=dict)
    remembered: Mapping[str, Any] = field(default_factory=dict)
    """What the journal already remembers when the registration runs: the claims it has taken, the marks that something was said. A handler reads this where a row would be too much to seed."""
    transcript: str = ""
    """The text of the agent's conversation as its provider writes it, put in a file inside the scratch project and named by the agent row, so a registration that reads what the agent last said finds it."""
    held: str = ""
    hook: Hooked = Hooked()
    """Why the agents' writes are already held when the registration runs, as a feature's hold would leave them, so a registration that refuses held calls can be played against one."""
    clock: At = At(WHEN)
    ids: Counting = Counting()
    chat: Answering = Answering({})
    commands: Answering = Answering({})
    files: Answering = Answering({})
    """Files that already exist, by path under the project folder to their text, written there before the play so what a registration reads from disk is what the Given says."""
    processes: Answering = Answering({})
    """The programs on the machine, by name to where they live. A Given that names none leaves the machine's own; one that names any says every other program is absent."""
    providers: Answering = Answering({})
    git: Answering = Answering({})
    """What the project's git says, and a Given that names none leaves the project's own, by what is asked of it: ("checkout",) to the checkout the folder is in (or none), ("worktree",) to the linked checkout, ("git", *arguments) to what the command printed, ("stamp", file name) to when that log last moved, ("blobs", the hashes asked for) to their texts. The play's project is no git repository, so nothing is read from one."""
    journal_root: Answering = Answering({})
    """What the journal's own folder holds, and a Given that names none leaves the scratch journal's own, by path or pattern: ("glob", pattern) to the paths it lists, ("modified", path) to when one changed, ("exists", path), ("sweep", name) to whether this process took the sweep, ("environments",) to the environments there are; every write to it is remembered as a run."""
    viewer: Answering = Answering({})
    """Whether a viewer runs, and a Given that names none leaves the machine's own: ("running",) to the address it runs at. Every tab shown is remembered as a run."""
    own_work: Answering = Answering({})
    """What the asking feature's own work answers, by the method it was asked to do and its arguments: ("ticked",) to what that returned; every call is remembered as a run, as ("own work", method, *arguments), and an ask the Given does not name returns nothing."""

    @classmethod
    def of(cls, on, *rows, **more) -> "Given":
        """What an event meets when these rows are already there, the rows named as they are and not as a keyword."""
        return cls(on, rows=rows, **more)

    def __rshift__(self, outcomes) -> "Expectation":
        return Expectation(self, Outcomes.of(outcomes))


@dataclass(frozen=True)
class Expectation:
    given: Given
    outcomes: Outcomes

    def __and__(self, other) -> "Expectation":
        """`>>` binds tighter than `&`, so the outcomes after the first one are joined onto the expectation itself."""
        return Expectation(self.given, self.outcomes & other)
