from core.base.module.module import Module
from core.base.template.template_declaration import TemplateDeclaration
from tests.stories.core.modules.profiles.support.notes_suite import NotesSuite
from tests.stories.core.modules.profiles.support.notes_driver import NotesDriver


class NotesModule(Module):
    name = "notes"
    requires_core = ">=5,<6"
    seed_reason = "the module declares profiles and templates without seeding its own rows"
    move_reason = "the suite has no earlier rows"
    suites = [NotesSuite]
    drivers = [NotesDriver]
    templates = [TemplateDeclaration(title="Summarize notes", brief="Summarize the notes.", targets=tuple(["doc"]))]
