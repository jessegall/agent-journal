"""What every registration promises: the expectations it carries, gathered as the features are wired.

A registration's expects are its test, its documentation and its contract in one place. They are kept
here as the features register, so the generated run can play every one of them without opening a
single test file, and so the boot walk can refuse a kind that owes them and carries none.
"""

from dataclasses import dataclass

from engine.kinds import ByKind
from framework.loaded import FEATURES


THE_ENGINES_OWN = ("SendOnTheClock", "SendOnToolUse")
"""Feature.wire adds these two for every feature that declares nudges. They are the engine's own, written once, and the nudges they send are promised by the handlers that cause them."""


@dataclass(frozen=True)
class Promise:
    """One registration and what it says it does."""

    feature: object
    kind: str
    name: str
    part: object
    event: type
    expects: tuple = ()

    @property
    def owes(self) -> bool:
        """Every registration owes its expectations but two kinds: a line appender, where the engine does all the work and the feature only supplies a value, and the engine's own, which no feature wrote."""
        return self.kind not in ("append_to_line", "route") and self.name not in THE_ENGINES_OWN

    @property
    def named_as(self) -> tuple[str, str, str]:
        """What makes this registration itself: its feature, its kind and its own name."""
        return (self.feature.name, self.kind, self.name)

    @classmethod
    def of(cls, registration) -> "Promise":
        """A registration written for the 3.0 engine, as the promise the play and the watch read."""
        return cls(FEATURES[registration.feature], registration.kind, registration.name, registration.receiver, registration.event, registration.expects)

    def called(self, n: int) -> str:
        """What a failure is named after, so it names the promise and not a line number."""
        return f"{self.feature.name}/{self.name}/{n}"


class Owing(LookupError):
    """A feature registered something that owes expectations and carries none."""

    @classmethod
    def of(cls, feature: str, owed: list[Promise]) -> "Owing":
        return cls(f"feature {feature} registers {', '.join(f'{one.kind} {one.name}' for one in owed)} without expects; every registration of these kinds says what it expects")


class Promises(ByKind):
    """Every registration the features made, in the order they made it."""

    def __init__(self):
        self.each: list[Promise] = []

    def add(self, promise: Promise) -> None:
        """Keeps one entry per registration. Loading the features again re-registers them, and a registry that appended would double every promise it holds."""
        self.each = [one for one in self.each if one.named_as != promise.named_as]
        self.each.append(promise)

    def owed(self) -> list[Promise]:
        """The registrations that owe expectations and carry none, which is what the boot walk refuses."""
        return [one for one in self.each if one.owes and not one.expects]

    def refuse_owing(self, feature: str) -> None:
        """Called as a feature is wired: refuses the boot, naming the feature and its registrations, when it registered an owing kind with no expects. Unconditional since the sweep of phase 2 finished and every owing registration carried one; a new registration that owes expectations and brings none does not boot."""
        owed = [one for one in self.owed() if one.feature.name == feature]
        if owed:
            raise Owing.of(feature, owed)

    def played(self) -> list[tuple[Promise, int, object]]:
        """Every expectation of every registration, each with the name a failure is reported under."""
        return [(one, n, expectation) for one in self.each for n, expectation in enumerate(one.expects)]

    def clear(self) -> None:
        self.each.clear()


PROMISED = Promises()
