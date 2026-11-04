from core.base.module.module import Module
from core.base.viewer.button_declaration import ButtonDeclaration

PATH = "tests.stories.core.modules.viewer.support.button_module:NotesButtonsModule"


class NotesButtonsModule(Module):
    name = "notes"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.tasks"]
    button_slots = ["notes.toolbar"]
    buttons = [ButtonDeclaration("notes.edit", ("row.task", "notes.toolbar"), "Edit", "task edit {row_id}")]
