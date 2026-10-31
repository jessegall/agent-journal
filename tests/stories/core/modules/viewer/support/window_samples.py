from core.base.change.change import Change
from core.base.driver.suite import Suite
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.module.module import Module
from core.base.viewer.layout_preset import LayoutPreset
from core.base.viewer.layout_shape import split, tabs
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.choice_option import ChoiceOption
from core.base.viewer.toggle_option import ToggleOption
from core.base.viewer.window_size import WindowSize
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
    windows = ["notes.board", "notes.summary", "notes.planner"]
    presets = {"home": [LayoutPreset("board", "Board", "The notes board alone", tabs("notes.board")),
                        LayoutPreset("both", "Both", "Board and summary", split("row", 0.5, tabs("notes.board"), tabs("notes.summary")))]}


class NotesModule(Module):
    """A sample module the journal does not ship, with one window that reads and starts tasks."""

    name = "notes"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.tasks", "journal.core.viewer", "journal.core.drivers"]
    guards = [NotesStartCheck]
    suites = [NotesSuite]
    windows = [WindowDeclaration("notes.board", "Notes board", "board.html", WindowLoading.FRAME, reads=["task list"], runs=["task start"]),
               WindowDeclaration("notes.summary", "Notes summary", "task list", WindowLoading.DOCUMENT, reads=["task list"]),
               WindowDeclaration("notes.planner", "Notes planner", "board.html", WindowLoading.FRAME, reads=["task list"], icon=WindowIcon.PLAN,
                                 float_size=WindowSize(440, 380), count="task list",
                                 options=[ToggleOption("flush", "Flush"), ChoiceOption("range", "Range", (("week", "Week"), ("month", "Month")), "week")])]


class WiderNotesModule(NotesModule):
    """The notes module after an upgrade whose board also reads plans."""

    windows = [WindowDeclaration("notes.board", "Notes board", "board.html", WindowLoading.FRAME, reads=["task list", "plan list"], runs=["task start"]),
               WindowDeclaration("notes.summary", "Notes summary", "task list", WindowLoading.DOCUMENT, reads=["task list"])]


class GrantingNotesModule(NotesModule):
    """The notes module with a board that declares the lines that give rights and change settings."""

    windows = [WindowDeclaration("notes.board", "Notes board", "board.html", WindowLoading.FRAME, reads=["task list"],
                                 runs=["window allow", "window trust", "setting make", "setting edit", "viewer-layout save"])]
