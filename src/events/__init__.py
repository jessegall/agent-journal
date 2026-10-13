"""The event catalogue: the two classes every event is one of, beside a module per resource type and per feature.

A Fact says something happened; only listeners and handlers receive it. A Request is a question the engine
must answer before it can go on; only answerers receive it. The kind says what the event is, so no name is
read for its tense. Nothing here imports a feature, so a cycle cannot form.
"""

from dataclasses import dataclass, replace


@dataclass(frozen=True, kw_only=True)
class Event:
    """Every event carries the id of the event whose tick dispatched it, which the engine fills in."""

    id: str = ""
    """What the engine called this event when it dispatched it, so the one it causes can point back at it."""

    cause: str = ""

    @classmethod
    def name(cls) -> str:
        return cls.__name__

    def caused_by(self, causing: "Event", id: str) -> "Event":
        """The same event as the engine dispatches it: named, and pointing at the event whose tick dispatched it."""
        return replace(self, id=id, cause=causing.id)


@dataclass(frozen=True, kw_only=True)
class Fact(Event):
    """Something that happened, carrying everything a handler could need, so no handler reads the record to fill in what the listener knew."""

    claim: str = ""
    trigger: tuple = ()
    """The behaviour whose trigger says when this fact goes on, for a fact dispatched with due: empty for one that is not paced, the empty name for the feature's own trigger."""
    spacing: tuple = ()
    """The key and the seconds a fact dispatched with spaced is held to, at most once per span."""

    def once(self, key: str) -> "Fact":
        """Dispatched at most once for this key: the engine claims it at dispatch and drops the fact when the claim is lost."""
        return replace(self, claim=key)

    def spaced(self, key: str, seconds: float) -> "Fact":
        """Dispatched at most once every so many seconds for this key: one dispatched sooner is held, the newest replacing the rest, and runs when the time is up, so the last state always lands."""
        return replace(self, spacing=(key, seconds))

    def every(self, key: str, seconds: float, now: float) -> "Fact":
        """Dispatched at most once in each span of so many seconds for this key while what raises it holds; one raised again within the span is dropped, never sent late."""
        return self.once(f"{key}|{int(now // seconds)}")

    def due(self, behaviour: str = "") -> "Fact":
        """Dispatched only when the dispatching feature's trigger for this behaviour says it is due: the engine counts the moment and drops the fact until then."""
        return replace(self, trigger=(behaviour,))


@dataclass(frozen=True, kw_only=True)
class Request(Event):
    """A question the engine must answer before it can go on, such as whether a tool call may run. Its answerers are read-only and the engine reduces their answers once."""
