"""The services a receiver asks for by type, resolved at boot and never None.

A receiver names what it needs in its signature and the engine hands it the thing itself, so nothing is
reached for through a global. Each service says whether it writes, which is how the boot walk knows a
synchronous receiver is read-only and which two handlers on one fact need an order between them.
"""

from typing import ClassVar, Generic, TypeVar, get_args, get_origin

T = TypeVar("T")


class Service:
    """One thing a receiver may ask for. Reading is always allowed; writing is what has to be declared."""

    writes: ClassVar[bool] = False

    @classmethod
    def written(cls, asked) -> str:
        """The kind of row this service writes, as the boot walk keys it. Empty when it writes nothing of its own."""
        return cls.__name__ if cls.writes else ""


class Rows(Service, Generic[T]):
    """The controller for one kind of row, asked for as Rows[Todo]: the one funnel that reads, writes and emits for that type."""

    writes = True

    @classmethod
    def written(cls, asked) -> str:
        kind = get_args(asked)
        return kind[0].__name__ if kind and isinstance(kind[0], type) else cls.__name__


class Chat(Service):
    """What the agent says and what the journal says back to it."""

    writes = True


class Files(Service):
    """The project's files, outside the record."""

    writes = True


class Processes(Service):
    """Processes the journal starts and stops, such as an agent or a server."""

    writes = True


class Commands(Service):
    """Journal commands run as a command, for the work a controller does not expose."""

    writes = True


class Settings(Service):
    """The settings and feature switches in force, read at boot and on change."""

    writes = True


class Providers(Service):
    """What a provider says: its transcript, its turns, its hook replies. It answers and changes nothing."""


class Clock(Service):
    """The time. It comes from here and never from the module, so an expectation is exact."""


class Ids(Service):
    """The next id. It comes from here and never from the module, for the same reason."""


def writing(wants: dict[str, object]) -> set[str]:
    """The kinds of row a receiver writes, keyed by what is written rather than by which service does it: two handlers both asking for Chat need no order, two both writing Todos do."""
    written = set()
    for asked in wants.values():
        service = get_origin(asked) or asked
        if isinstance(service, type) and issubclass(service, Service) and service.writes:
            written.add(service.written(asked))
    return written
