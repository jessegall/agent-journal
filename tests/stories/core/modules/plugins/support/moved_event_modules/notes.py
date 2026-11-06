from dataclasses import dataclass

from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from tests.stories.core.modules.plugins.support import event_modules


@dataclass(frozen=True, kw_only=True)
class EventNote(event_modules.EventNote):
    """The sample note after its file moved to another folder."""


class NoteCreatedListener(event_modules.NoteCreatedListener):
    """The sample listener after its file moved to another folder."""


class NotesModule(Module):
    name = event_modules.NotesModule.name
    requires_core = event_modules.NotesModule.requires_core
    models = [ModelDeclaration(EventNote)]
    migrations = event_modules.NotesModule.migrations
    handlers = event_modules.NotesModule.handlers
    listeners = [NoteCreatedListener]
    former_event_keys = event_modules.NotesModule.former_event_keys
