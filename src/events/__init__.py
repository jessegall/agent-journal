"""The event catalogue: the two classes every event is one of, beside a module per resource type and per feature.

A Fact says something happened; only listeners and handlers receive it. A Request is a question the engine
must answer before it can go on; only answerers receive it. The kind says what the event is, so no name is
read for its tense. Nothing here imports a feature, so a cycle cannot form.
"""

from dataclasses import dataclass, replace


@dataclass(frozen=True, kw_only=True)
class Event:
    """Every event carries the id of the event whose tick dispatched it, which the engine fills in."""

    cause: str = ""

    @classmethod
    def name(cls) -> str:
        return cls.__name__


@dataclass(frozen=True, kw_only=True)
class Fact(Event):
    """Something that happened, carrying everything a handler could need, so no handler reads the record to fill in what the listener knew."""

    claim: str = ""

    def once(self, key: str) -> "Fact":
        """Dispatched at most once for this key: the engine claims it at dispatch and drops the fact when the claim is lost."""
        return replace(self, claim=key)


@dataclass(frozen=True, kw_only=True)
class Request(Event):
    """A question the engine must answer before it can go on, such as whether a tool call may run. Its answerers are read-only and the engine reduces their answers once."""
