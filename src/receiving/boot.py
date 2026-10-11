"""The walk the engine makes over every registration before the first event is dispatched.

Everything is resolved once, here: which event each receiver takes, which services it asks for, and the
order the handlers of one fact run in. At run time a tick only looks things up. Every refusal below is
raised on start, by name, rather than on the first event three weeks later.
"""

from receiving import ANSWER, HANDLE, KINDS, LISTEN, REFUSE, Registrations
from receiving.ordering import ordered
from serving import Service, writing

READ_ONLY = (LISTEN, ANSWER, REFUSE)
"""The kinds that run synchronously, before or instead of a tick. None of them may write."""


class AsksForNothingKnown(LookupError):
    @classmethod
    def of(cls, receiver: str, name: str, asked) -> "AsksForNothingKnown":
        return cls(f"{receiver} asks for {name}: {asked} is not a service the engine answers for")


class AsksForWhatIsNotServed(LookupError):
    @classmethod
    def of(cls, receiver: str, name: str) -> "AsksForWhatIsNotServed":
        return cls(f"{receiver} asks for {name}, which this journal serves to nobody; a receiver is handed the thing itself, never None")


class WritesSynchronously(TypeError):
    @classmethod
    def of(cls, receiver: str, kind: str, written: set[str]) -> "WritesSynchronously":
        noun = KINDS[kind][0].__name__.lower()
        return cls(f"{receiver} is an {noun} and writes {', '.join(sorted(written))}; an {noun} runs while the agent waits, so it may only read. "
                   f"Move what writes into a handler on the fact it dispatches.")


def walked(registered: Registrations, served: set[type]) -> None:
    """Checks every registration against the services this journal has. Raises on the first thing that could not work."""
    for one in registered.each:
        wants = type(one.receiver).wants()
        for name, asked in wants.items():
            service = getattr(asked, "__origin__", asked)
            if not (isinstance(service, type) and issubclass(service, Service)):
                raise AsksForNothingKnown.of(one.name, name, asked)
            if service not in served:
                raise AsksForWhatIsNotServed.of(one.name, name)
        if one.kind in READ_ONLY and (written := writing(wants)):
            raise WritesSynchronously.of(one.name, one.kind, written)
    for fact in {one.event for one in registered.of(HANDLE)}:
        ordered(fact, [one for one in registered.of(HANDLE) if one.event is fact])
