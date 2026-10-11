"""What every registration promises: the expectations it carries, gathered as the features are wired.

A registration's expects are its test, its documentation and its contract in one place. They are kept
here as the features register, so the generated run can play every one of them without opening a
single test file, and so the boot walk can refuse a kind that owes them and carries none.
"""

from dataclasses import dataclass


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
        """Every kind owes its expectations but the line appenders, where the engine does all the work and the feature only supplies a value."""
        return self.kind not in ("append_to_line",)

    def called(self, n: int) -> str:
        """What a failure is named after, so it names the promise and not a line number."""
        return f"{self.feature.name}/{self.name}/{n}"


class Promises:
    """Every registration the features made, in the order they made it."""

    def __init__(self):
        self.each: list[Promise] = []

    def add(self, promise: Promise) -> None:
        self.each.append(promise)

    def of(self, kind: str) -> list[Promise]:
        return [one for one in self.each if one.kind == kind]

    def owed(self) -> list[Promise]:
        """The registrations that owe expectations and carry none, which is what the boot walk refuses once phase 2 is through."""
        return [one for one in self.each if one.owes and not one.expects]

    def played(self) -> list[tuple[Promise, int, object]]:
        """Every expectation of every registration, each with the name a failure is reported under."""
        return [(one, n, expectation) for one in self.each for n, expectation in enumerate(one.expects)]

    def clear(self) -> None:
        self.each.clear()


PROMISED = Promises()
