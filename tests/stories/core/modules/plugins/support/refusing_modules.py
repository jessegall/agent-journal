from dataclasses import dataclass

from core.base.command.bus import Bus
from core.base.command.command import Command
from core.base.command.context import Context
from core.base.change.created import Created
from core.base.command.handler import Handler
from core.base.guard.guard import Guard
from core.base.module.module import Module
from core.base.query.queries import Queries
from engine.errors.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.processes.commands.grant_run_slots.grant_run_slots import GrantRunSlots
from core.modules.processes.models.process import Process
from tests.stories.core.modules.plugins.support.event_modules import EventNote

REFUSING = "tests.stories.core.modules.plugins.support.refusing_modules:RefusingModule"
REFUSED_NOTES = "tests.stories.core.modules.plugins.support.refusing_modules:NoteTitleGuardModule"
LATER_KEY_REFUSAL = "a later key refuses this"
REFUSED_NOTE_TITLE = "Refused note"


@dataclass(frozen=True)
class DeleteProcessRow(Command[None]):
    process_id: int
    is_refused: bool


class DeleteProcessRowHandler(Handler[DeleteProcessRow, None]):
    command = DeleteProcessRow

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: DeleteProcessRow, context: Context) -> None:
        self.repository.delete(self.queries.query(Process).find(command.process_id), context)
        if command.is_refused:
            raise Refusal(LATER_KEY_REFUSAL)


@dataclass(frozen=True)
class OrphanProcessRow(Command[None]):
    process_id: int
    is_refused: bool


class OrphanProcessRowHandler(Handler[OrphanProcessRow, None]):
    command = OrphanProcessRow

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: OrphanProcessRow, context: Context) -> None:
        process = self.queries.query(Process).find(command.process_id)
        self.repository.save_change(process, process.orphan(context.timestamp, context.actor), context)
        if command.is_refused:
            raise Refusal(LATER_KEY_REFUSAL)


@dataclass(frozen=True)
class SlotsCreateNote(Command[EventNote]):
    title: str


class SlotsCreateNoteHandler(Handler[SlotsCreateNote, EventNote]):
    """Dispatches a command that runs once, then saves a row on a key a guard script hears."""

    command = SlotsCreateNote

    def __init__(self, bus: Bus, repository: Repository) -> None:
        self.bus, self.repository = bus, repository

    def handle(self, command: SlotsCreateNote, context: Context) -> EventNote:
        self.bus.dispatch(GrantRunSlots(), context)
        return self.repository.save(EventNote(title=command.title), context)


class NoteTitleGuard(Guard[Created[EventNote]]):
    """A note with the refused title is never saved."""

    name = "acme.refused-note"

    def check(self, event: Created[EventNote], context: Context) -> None:
        if event.row.title == REFUSED_NOTE_TITLE:
            raise Refusal(LATER_KEY_REFUSAL)


class RefusingModule(Module):
    name = "acme.refusing"
    requires_core = ">=5,<6"
    handlers = [DeleteProcessRowHandler, OrphanProcessRowHandler, SlotsCreateNoteHandler]


class NoteTitleGuardModule(Module):
    name = "acme.refused-notes"
    requires_core = ">=5,<6"
    guards = [NoteTitleGuard]
