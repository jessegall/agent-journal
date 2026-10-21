from contextvars import ContextVar

from journal.events.models.created import Created
from journal.events.listener import Listener
from journal.support.actor_kind import ActorKind
from journal.models.command_output import CommandOutput
from journal.models.entry import Entry
from journal.models.model import Model

RUN: ContextVar[list | None] = ContextVar("creations", default=None)


class Creations(Listener[Created]):
    """Every row made while a command runs, by the command or by what its events caused, so the agent is told each one's name and number."""

    def handle(self, event: Created) -> None:
        made = RUN.get()
        if made is not None and event.actor.kind != ActorKind.SYSTEM and not isinstance(event.model, (Entry, CommandOutput)):
            made.append(event.model)

    @staticmethod
    def begin() -> list[Model]:
        made: list[Model] = []
        RUN.set(made)
        return made

    @staticmethod
    def end() -> None:
        RUN.set(None)

    @classmethod
    def line(cls, made: list[Model], said: str) -> str:
        unnamed = [name for m in made if (name := cls.named(m)) not in said]
        return "created: " + ", ".join(unnamed) if unnamed else ""

    @staticmethod
    def named(made: Model) -> str:
        table = made.table()
        return f"{table[:-3] + 'y' if table.endswith('ies') else table[:-1]} {made.id}"
