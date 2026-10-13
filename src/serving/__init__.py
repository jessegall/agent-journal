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


class ReadRows(Rows[T]):
    """The controller for one kind of row, asked for to read only, as ReadRows[Profile]: what a listener or an answerer reads rows through, since neither may write."""

    writes = False


class Remembered(Service):
    """What the asking feature keeps between events, journal-wide; what it keeps for one agent it keys by that agent."""

    writes = True


class ReadRemembered(Remembered):
    """The same, asked for to read only, as a listener or an answerer reads it."""

    writes = False


class Sessions(Service):
    """The agent sessions this journal runs: which session holds an environment, what a session is bound to, and lending an environment to a session's subagents."""

    writes = True


class ReadSessions(Sessions):
    """The agent sessions, asked for to read only, as a listener or an answerer reads them."""

    writes = False


class Terminal(Service):
    """The terminal of the agent the event is about, which the journal presses keys in, such as moving its running command to the background."""

    writes = True


class Marks(Service):
    """What the journal keeps of when the asking feature last did something for the agent the event is about, and the counts and once-claims that pace it."""

    writes = True


class ReadMarks(Marks):
    """The same, asked for to read only."""

    writes = False


class Holds(Service):
    """Why the writes of the agent the event is about are held, by every hold that stands against it."""


class Elsewhere(Service):
    """Another environment of this journal, by its name: its rows, and the chat of its agent, as the asking feature speaks there."""

    writes = True


class ReadElsewhere(Elsewhere):
    """The same, asked for to read only."""

    writes = False


class Git(Service):
    """The git checkouts of the project: which one a folder is in and on what branch, what git says about it, when its logs last moved, and linking a worktree to the journal."""

    writes = True


class ReadGit(Git):
    """The git checkouts, asked for to read only, as a listener or an answerer reads them."""

    writes = False


class JournalRoot(Service):
    """The journal's own folder, outside the record: its runtime files and logs, the sweeps the whole project shares, and every environment by name."""

    writes = True


class ReadJournalRoot(JournalRoot):
    """The journal's folder, asked for to read only."""

    writes = False


class Chat(Service):
    """What the agent says and what the journal says back to it."""

    writes = True


class Files(Service):
    """The project's files, outside the record."""

    writes = True


class ReadFiles(Files):
    """The project's files, asked for to read only, as a listener or an answerer reads them."""

    writes = False


class Processes(Service):
    """Processes the journal starts and stops, such as an agent or a server."""

    writes = True


class ReadProcesses(Processes):
    """The processes, asked for to read only, as a listener or an answerer reads them."""

    writes = False


class Commands(Service):
    """Journal commands run as a command, for the work a controller does not expose."""

    writes = True


class Settings(Service):
    """The asking feature's settings in force, read at boot and on change."""


class Providers(Service):
    """What a provider says: its transcript, its turns, its hook replies. It answers and changes nothing."""


class Clock(Service):
    """The time. It comes from here and never from the module, so an expectation is exact."""


class Ids(Service):
    """The next id. It comes from here and never from the module, for the same reason."""


class Adapted(Service):
    """The tick's record itself, asked for by the adapter and the engine's own senders of declared nudges, which build a Context over it. A swept feature asks for the controller it needs instead."""

    writes = True

    @classmethod
    def written(cls, asked) -> str:
        """None that can be named: whatever a Context over the record writes, so no order between two of them can be worked out."""
        return ""


def writing(wants: dict[str, object]) -> set[str]:
    """The kinds of row a receiver writes, keyed by what is written rather than by which service does it: two handlers both asking for Chat need no order, two both writing Todos do."""
    written = set()
    for asked in wants.values():
        service = get_origin(asked) or asked
        if isinstance(service, type) and issubclass(service, Service) and service.writes and (name := service.written(asked)):
            written.add(name)
    return written


class NothingServes(LookupError):
    @classmethod
    def of(cls, kind: type) -> "NothingServes":
        return cls(f"nothing in this journal answers {kind.__name__}; the layer that can do it says so at seating, and a journal that cannot do it at all refuses here rather than pretending")


class Serving:
    """What answers each service in this process. The layer that knows how to do a thing says so once, at seating, and whoever needs it asks by type: a controller never reaches up to the code that does the work."""

    def __init__(self):
        self.answering: dict[type, object] = {}

    def answered(self, kind: type, doing_it) -> None:
        """Says what does this kind of work here. Called once, at seating, by the layer that can do it."""
        self.answering[kind] = doing_it

    def given(self, kind: type):
        if kind not in self.answering:
            raise NothingServes.of(kind)
        return self.answering[kind]


SERVED = Serving()
"""The one answering map of this process, seated once and read by type."""
