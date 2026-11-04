from core.base.module.module import Module
from tests.stories.core.modules.profiles.support.notes_suite import NotesSuite
from tests.stories.core.modules.profiles.support.notes_driver import NotesDriver


class NotesModule(Module):
    name = "notes"
    requires_core = ">=5,<6"
    seed_reason = "the suite declares profiles and templates, not its own rows"
    move_reason = "the suite has no earlier rows"
    suites = [NotesSuite]
    drivers = [NotesDriver]
