from dataclasses import dataclass

from engine.change.created import Created
from engine.change.logged_event import LoggedEvent
from engine.command.command import Command
from engine.command.context import Context
from engine.command.handler import Handler
from core.base.database.migration import Migration
from core.base.listener.commit_listener import CommitListener
from core.base.listener.save_listener import SaveListener
from engine.model.model import Model
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.tasks.models.task import Task

PATH = "tests.stories.core.modules.plugins.support.event_modules"
NOTES = f"{PATH}:NotesModule"
REMOVED_NOTES_MODULE = f"{PATH}:NotesGoneModule"
NOTES_MOVED = "tests.stories.core.modules.plugins.support.moved_event_modules.notes:NotesModule"
FAILS_LATER = f"{PATH}:FailsLaterModule"
CLASHING = f"{PATH}:ClashingModule"
NOTE_CREATED = "acme.events.event_note.created"
FORMER_NOTE_CREATED = "acme.events.old_note.created"
CLASHING_KEY = "acme.clash.clash_note.created"
REFUSED_TITLE = "Refused later"
LATER_REFUSAL = "the later listener refuses this"


@dataclass(frozen=True, kw_only=True)
class EventNote(Model):
    """A sample row with a hidden field, so a story raises keys of its own module."""

    model_name = "event_note"
    cli_name = "event-note"
    hidden_fields = frozenset({"secret"})

    title: str
    secret: str = ""


class EventNotesTable(Migration):
    number = 1
    statements = ("CREATE TABLE event_notes (id INTEGER PRIMARY KEY, title TEXT NOT NULL, secret TEXT NOT NULL DEFAULT '', version INTEGER NOT NULL DEFAULT 1,"
                  " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",)


@dataclass(frozen=True)
class ManyNotes(Command[int]):
    """Makes this many notes in one command."""

    count: int


class ManyNotesHandler(Handler[ManyNotes, int]):
    command = ManyNotes

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: ManyNotes, context: Context) -> int:
        for number in range(command.count):
            self.repository.save(EventNote(title=f"Note {number}"), context)
        return command.count


class NoteCreatedListener(CommitListener[Created[EventNote]]):
    name = "acme.note-seen"

    def handle(self, event: Created[EventNote], logged: LoggedEvent) -> None:
        pass


class NotesModule(Module):
    name = "acme.events"
    requires_core = ">=5,<6"
    models = [ModelDeclaration(EventNote)]
    migrations = [EventNotesTable]
    handlers = [ManyNotesHandler]
    listeners = [NoteCreatedListener]
    former_event_keys = {FORMER_NOTE_CREATED: NOTE_CREATED}


class NotesGoneModule(Module):
    """The same module once its code no longer raises the keys of notes."""

    name = "acme.events"
    requires_core = ">=5,<6"
    migrations = [EventNotesTable]


class FailsLater(SaveListener[Created[Task]]):
    name = "acme.fails-later"

    def handle(self, event: Created[Task], context: Context) -> None:
        if event.row.title == REFUSED_TITLE:
            raise Refusal(LATER_REFUSAL, "use another title")


class FailsLaterModule(Module):
    name = "acme.fails-later"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.tasks"]
    listeners = [FailsLater]


@dataclass(frozen=True, kw_only=True)
class ConflictingNote(Model):
    """A sample row with a change name that gives the same key as its creation."""

    model_name = "clash_note"
    cli_name = "clash-note"
    change_names = tuple(["created"])

    title: str


class ConflictingNotesTable(Migration):
    number = 1
    statements = ("CREATE TABLE clash_notes (id INTEGER PRIMARY KEY, title TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1,"
                  " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",)


class ClashingModule(Module):
    name = "acme.clash"
    requires_core = ">=5,<6"
    models = [ModelDeclaration(ConflictingNote)]
    migrations = [ConflictingNotesTable]
