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
        produced = RUN.get()
        if produced is not None and event.actor.kind != ActorKind.SYSTEM and not isinstance(event.model, (Entry, CommandOutput)):
            produced.append(event.model)

    @staticmethod
    def begin() -> list[Model]:
        produced: list[Model] = []
        RUN.set(produced)
        return produced

    @staticmethod
    def end() -> None:
        RUN.set(None)

    @classmethod
    def line(cls, produced: list[Model], line_text: str) -> str:
        anonymous = [name for m in produced if (name := cls.lookup(m)) not in line_text]
        return "created: " + ", ".join(anonymous) if anonymous else ""

    @staticmethod
    def lookup(produced: Model) -> str:
        return f"{produced.noun()} {produced.id}"
