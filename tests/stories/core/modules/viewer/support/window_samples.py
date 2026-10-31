from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_loading import WindowLoading

NOTES = "tests.stories.core.modules.viewer.support.window_samples:NotesModule"


class NotesModule(Module):
    """A sample module the journal does not ship, with one window that reads and starts tasks."""

    name = "notes"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.tasks", "journal.core.viewer"]
    windows = [WindowDeclaration("notes.board", "Notes board", "board.html", WindowLoading.FRAME, reads=["task list"], runs=["task start"])]
