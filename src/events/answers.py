"""What an answerer gives back, and how a request reduces its answerers' answers into one.

A request is answered once. Its answerers run synchronously, read-only, in declared order, and the
request's own rule says what the engine does with what they said: which answer wins and which compose.
The rule belongs to the request because it is the request that knows what an answer means.
"""

from dataclasses import dataclass
from typing import ClassVar

from events import Request


class NotTheRequestsAnswer(TypeError):
    @classmethod
    def of(cls, request: type, answer, wanted: type) -> "NotTheRequestsAnswer":
        return cls(f"{request.__name__} is answered with {wanted.__name__}, not with {type(answer).__name__}")


@dataclass(frozen=True)
class Answer:
    """One answerer's answer. What it means to the request is the request's rule, never the answerer's."""


@dataclass(frozen=True)
class Allowed(Answer):
    """Nothing to say: the thing asked about goes on as it was."""


@dataclass(frozen=True)
class Refused(Answer):
    """The thing asked about must not happen, and this is why."""

    why: str


@dataclass(frozen=True)
class Rewritten(Answer):
    """The thing asked about happens, with this in place of what was asked."""

    text: str


@dataclass(frozen=True)
class Kept(Answer):
    """The thing asked about reaches nobody: the turn's words belong to the row its tag writes, not to the chat."""


class Reduced:
    """How one request turns its answerers' answers into the one answer that leaves."""

    stops: ClassVar[tuple[type, ...]] = ()
    """The answers that end the question on their own, whatever the others said."""

    @classmethod
    def of(cls, request: type, given: list[Answer]) -> Answer:
        for answer in given:
            if not isinstance(answer, Answer):
                raise NotTheRequestsAnswer.of(request, answer, Answer)
        return cls.reduce(given)

    @classmethod
    def reduce(cls, given: list[Answer]) -> Answer:
        """The first answer that stops the question wins; otherwise the rewrites compose, each reading what the one before it wrote."""
        for answer in given:
            if cls.stops and isinstance(answer, cls.stops):
                return answer
        rewritten = [answer for answer in given if isinstance(answer, Rewritten)]
        return rewritten[-1] if rewritten else Allowed()


class FirstRefusalWins(Reduced):
    """A tool call, and a row about to be written: one refusal stops it, whatever the others said."""

    stops = (Refused,)


class KeepingWins(Reduced):
    """A message about to be sent: one answerer keeping it out of the chat wins, since the turn's words belong to the row its tag writes."""

    stops = (Kept,)


class TextsCompose(Reduced):
    """A text to format: no answer wins, because every formatter reads what the one before it wrote."""


@dataclass(frozen=True, kw_only=True)
class Asked(Request):
    """A request that says how it is answered. The engine reads the rule off the class, so no caller chooses it."""

    reduces: ClassVar[type[Reduced]] = Reduced

    def rewritten(self, text: str) -> "Asked":
        """The request the next answerer reads once one rewrote it; a request with no text of its own reads the same."""
        return self

    @classmethod
    def answered(cls, given: list[Answer]) -> Answer:
        return cls.reduces.of(cls, given)
