from contextvars import ContextVar

from journal.events.models.created import Created
from journal.events.listener import Listener
from journal.models.actor_kind import ActorKind
from journal.models.entry import Entry
from journal.models.model import Model

RUN: ContextVar[list | None] = ContextVar("creations", default=None)


class Creations(Listener[Created]):
    """Every row made while a command runs, by the command or by what its events caused, so the agent is told each one's name and number."""

    def handle(self, event: Created) -> None:
        made = RUN.get()
        if made is not None and event.by.kind != ActorKind.SYSTEM and not isinstance(event.model, Entry):
            made.append(event.model)

    @staticmethod
    def begin() -> list[Model]:
        made: list[Model] = []
        RUN.set(made)
        return made

    @staticmethod
    def end() -> None:
        RUN.set(None)

    @staticmethod
    def line(made: list[Model]) -> str:
        return "created: " + ", ".join(f"{m.table()[:-1] if not m.table().endswith('ies') else m.table()[:-3] + 'y'} {m.id}" for m in made)
