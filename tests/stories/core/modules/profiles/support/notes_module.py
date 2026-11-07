from core.base.module.module import Module
from core.base.agent_type import AgentType
from core.base.profile.agent_profile import AgentProfile
from core.base.template.template_declaration import TemplateDeclaration
from tests.stories.core.modules.profiles.support.notes_suite import NotesSuite
from tests.stories.core.modules.profiles.support.notes_driver import NotesDriver


class NotesModule(Module):
    name = "notes"
    dependencies = ["journal.core.agents"]
    agent_types = [AgentType("reader", "Reader", extends="helper")]
    profiles = [AgentProfile("journal-notes-reader", "Reads notes", "Read the notes.", agent_type="reader")]
    requires_core = ">=5,<6"
    seed_reason = "the module declares profiles and templates without seeding its own rows"
    move_reason = "the suite has no earlier rows"
    suites = [NotesSuite]
    drivers = [NotesDriver]
    templates = [TemplateDeclaration(title="Summarize notes", brief="Summarize the notes.", targets=tuple(["doc"]))]
