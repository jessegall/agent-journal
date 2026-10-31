from core.base.change.change import Change
from core.base.driver.suite import Suite
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_loading import WindowLoading

NOTES = "tests.stories.core.modules.viewer.support.window_samples:NotesModule"
GRANTING_NOTES = "tests.stories.core.modules.viewer.support.window_samples:GrantingNotesModule"
WIDER_NOTES = "tests.stories.core.modules.viewer.support.window_samples:WiderNotesModule"


class NotesStartCheck(Guard):
    """A sample guard on a task start that a short flag lets a person pass."""

    name = "notes.start-check"
    event = "task.start"
    short_flag = "anyway"

    def check(self, change: Change[Model]) -> None:
        return


class NotesSuite(Suite):
    """A sample suite that offers the notes board."""

    name = "notes"
    windows = ["notes.board", "notes.summary"]


class NotesModule(Module):
    """A sample module the journal does not ship, with one window that reads and starts tasks."""

    name = "notes"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.tasks", "journal.core.viewer", "journal.core.drivers"]
    guards = [NotesStartCheck]
    suites = [NotesSuite]
    windows = [WindowDeclaration("notes.board", "Notes board", "board.html", WindowLoading.FRAME, reads=["task list"], runs=["task start"]),
               WindowDeclaration("notes.summary", "Notes summary", "task list", WindowLoading.DOCUMENT, reads=["task list"])]


class WiderNotesModule(NotesModule):
    """The notes module after an upgrade whose board also reads plans."""

    windows = [WindowDeclaration("notes.board", "Notes board", "board.html", WindowLoading.FRAME, reads=["task list", "plan list"], runs=["task start"]),
               WindowDeclaration("notes.summary", "Notes summary", "task list", WindowLoading.DOCUMENT, reads=["task list"])]


class GrantingNotesModule(NotesModule):
    """The notes module with a board that declares the lines that give rights and change settings."""

    windows = [WindowDeclaration("notes.board", "Notes board", "board.html", WindowLoading.FRAME, reads=["task list"],
                                 runs=["window allow", "window trust", "setting make", "setting edit", "viewer-layout save"])]
