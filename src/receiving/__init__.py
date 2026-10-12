"""The four kinds of receiver a feature writes, one per registration kind.

A receiver names the event it receives twice: in its class, as Listener[AgentMessageSent], and in its
method's first argument. The engine reads both at boot and refuses a registration that names a third
thing, so a dispatch table is never built on a registration's word alone.
"""

from dataclasses import dataclass
from typing import Any, ClassVar, Generic, TypeVar, get_args, get_origin, get_type_hints

from engine.kinds import ByKind
from events import Event, Fact, Request
from serving import writing

E = TypeVar("E", bound=Event)
LISTEN, HANDLE, ANSWER, REFUSE = "listen", "handle", "answer", "refuse"


class NotAReceiver(TypeError):
    @classmethod
    def of(cls, receiver: type, wanted: type) -> "NotAReceiver":
        return cls(f"{receiver.__name__} is not a {wanted.__name__}, so it cannot be registered with {wanted.takes}")


class ReceivesNothing(TypeError):
    @classmethod
    def of(cls, receiver: type) -> "ReceivesNothing":
        return cls(f"{receiver.__name__} does not say which event it receives; write it as {receiver.__mro__[1].__name__}[TheEvent]")


class ReceivesAnother(TypeError):
    @classmethod
    def of(cls, receiver: type, receives: type, named: type) -> "ReceivesAnother":
        return cls(f"{receiver.__name__} receives {receives.__name__}, but the registration names {named.__name__}")


class ExpectsNothing(ValueError):
    @classmethod
    def of(cls, receiver: type) -> "ExpectsNothing":
        return cls(f"{receiver.__name__} registers no expectations; every registration of this kind says what it expects")


class Receiver(Generic[E]):
    """One receiver of one event, read at boot: which event it takes, and which services it asks for by type."""

    takes: ClassVar[str] = ""

    adapted: ClassVar[bool] = False
    """True only of the adapter that runs an unswept 2.x handler: it names its event in the registration rather than in its class, and owes no expectations, because the feature it belongs to has not been swept yet."""

    def called(self) -> str:
        """What this receiver is named in a walk and in an ordering: its class, unless it stands in for another receiver, which then lends its name."""
        return type(self).__name__

    @classmethod
    def receives(cls) -> type:
        for base in getattr(cls, "__orig_bases__", ()):
            if get_origin(base) is not None and (args := get_args(base)) and isinstance(args[0], type):
                return args[0]
        raise ReceivesNothing.of(cls)

    @classmethod
    def wants(cls) -> dict[str, type]:
        """The services the receiver asks for by type, after the event, resolved once at boot and never None."""
        hints = get_type_hints(getattr(cls, cls.takes))
        hints.pop("return", None)
        return dict(list(hints.items())[1:])


class Listener(Receiver[E]):
    """Reads an event and dispatches the facts it recognises, or none. It writes nothing and may ask only for read-only services."""

    takes = LISTEN

    def listen(self, event: E, **services) -> list[Fact]:
        raise NotImplementedError


class Handler(Receiver[E]):
    """Acts on a fact with the services it asks for, and returns the facts of what it did. It never decides whether to act: the fact already did."""

    takes = HANDLE

    def handle(self, event: E, **services) -> list[Fact]:
        raise NotImplementedError


class Answerer(Receiver[E]):
    """Answers a request, read-only and synchronously, before anything writes. The engine reduces the answerers' answers once, by the request's own rule."""

    takes = ANSWER

    def answer(self, event: E, **services) -> Any:
        raise NotImplementedError


class Refuser(Receiver[E]):
    """Reads a write about to happen on the funnel and raises Refused with its reason. A hold after the fact is no hold, so this stays synchronous."""

    takes = REFUSE

    def refuse(self, event: E, **services) -> None:
        raise NotImplementedError


KINDS = {LISTEN: (Listener, Fact), HANDLE: (Handler, Fact), ANSWER: (Answerer, Request), REFUSE: (Refuser, Event)}


@dataclass(frozen=True)
class Registration:
    """One registration, as the boot walk read it: everything a dispatch table needs, and nothing resolved later."""

    kind: str
    event: type
    receiver: Receiver
    expects: tuple
    feature: str = ""
    after: tuple[str, ...] = ()
    """The handlers on this fact that must run first, by name: a name and never a class, because importing another feature's class is what the boot walk forbids."""

    @property
    def name(self) -> str:
        return self.receiver.called()

    @property
    def writes(self) -> set[str]:
        """The kinds of row it writes, none for the adapter: an unswept handler names no order, so it runs in the order its feature registered, as on the 2.x bus, and is never held to commute with another."""
        return set() if type(self.receiver).adapted else writing(type(self.receiver).wants())

    @classmethod
    def read(cls, kind: str, event: type, receiver: Receiver, expects, feature: str = "", after: tuple[str, ...] = ()) -> "Registration":
        """Checks the receiver against the event the registration names, and refuses here rather than on the first event three weeks later."""
        wanted, _ = KINDS[kind]
        if not isinstance(receiver, wanted):
            raise NotAReceiver.of(type(receiver), wanted)
        if type(receiver).adapted:
            return cls(kind, event, receiver, tuple(expects), feature, tuple(after))
        if (receives := type(receiver).receives()) is not event:
            raise ReceivesAnother.of(type(receiver), receives, event)
        if not expects:
            raise ExpectsNothing.of(type(receiver))
        return cls(kind, event, receiver, tuple(expects), feature, tuple(after))


class Registrations(ByKind):
    """Every registration of the four kinds, in the order the features declared them, which is the order the boot walk checks and a tick runs."""

    def __init__(self):
        self.each: list[Registration] = []

    def add(self, registration: Registration) -> None:
        self.each.append(registration)

    def forget(self, kind: str, feature: str, name: str) -> None:
        """Drops one feature's registration of this name, so registering it again leaves one."""
        self.each = [one for one in self.each if (one.kind, one.feature, one.name) != (kind, feature, name)]

    def on(self, event: type) -> list[Registration]:
        return [one for one in self.each if one.event is event]

    def clear(self) -> None:
        self.each.clear()


REGISTERED = Registrations()
