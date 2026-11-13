from dataclasses import replace

from engine.module.module import Module
from core.modules.helpers.types.helper import Helper
from engine.profile.agent_profile import AgentProfile
from engine.template.template_declaration import TemplateDeclaration
from tests.stories.core.modules.profiles.support.notes_suite import NotesSuite
from tests.stories.core.modules.profiles.support.notes_driver import NotesDriver


class NotesReader(Helper):
    key = "reader"
    label = "Reader"
    behaviours = replace(Helper.behaviours, has_private_outputs=True)


class NotesModule(Module):
    name = "notes"
    dependencies = ["journal.core.agents"]
    helper_types = [NotesReader]
    profiles = [AgentProfile("journal-notes-reader", "Reads notes", "Read the notes.", agent_type="reader")]
    requires_core = ">=5,<6"
    seed_reason = "the module declares profiles and templates without seeding its own rows"
    move_reason = "the suite has no earlier rows"
    drivers = [NotesDriver]
    templates = [TemplateDeclaration(title="Summarize notes", brief="Summarize the notes.", targets=tuple(["doc"]))]


class NotesSuiteOfNotesModule(NotesSuite):
    modules = [NotesModule]
