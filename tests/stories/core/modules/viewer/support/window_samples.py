from engine.module.suite import Suite
from engine.guard.guard import Guard
from engine.model.model import Model
from engine.module.module import Module
from engine.enums.auto_scroll import AutoScroll
from engine.viewer.layout_preset import LayoutPreset
from engine.viewer.window_tab import WindowTab
from engine.viewer.layout_shape import split, tabs
from engine.viewer.window_declaration import WindowDeclaration
from engine.enums.window_icon import WindowIcon
from engine.viewer.choice_option import ChoiceOption
from engine.viewer.toggle_option import ToggleOption
from engine.viewer.window_size import WindowSize
from engine.enums.window_loading import WindowLoading
from engine.viewer.skeleton_part import SkeletonPart
from engine.event.moved import Moved
from engine.command.context import Context
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task

NOTES = "tests.stories.core.modules.viewer.support.window_samples:NotesModule"
GRANTING_NOTES = "tests.stories.core.modules.viewer.support.window_samples:GrantingNotesModule"
WIDER_NOTES = "tests.stories.core.modules.viewer.support.window_samples:WiderNotesModule"


class NotesStartCheck(Guard[Moved[Task]]):
    """A sample guard on a task start that a short flag lets a person pass."""

    name = "notes.start-check"
    moves = tuple([TaskLifecycle.start])
    short_flag = "anyway"

    def check(self, event: Moved[Task], context: Context) -> None:
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
    windows = [WindowDeclaration("notes.board", "Notes board", "board.html", WindowLoading.FRAME, skeleton=[SkeletonPart.line()], reads=["task list"], runs=["task start"]),
               WindowDeclaration("notes.summary", "Notes summary", "task list", WindowLoading.DOCUMENT, skeleton=[SkeletonPart.line()], reads=["task list"]),
               WindowDeclaration("notes.planner", "Notes planner", "board.html", WindowLoading.FRAME, skeleton=[SkeletonPart.line()], reads=["task list"], icon=WindowIcon.PLAN,
                                 float_size=WindowSize(440, 380), count="task list", auto_scroll=AutoScroll.TOP, tabs=[WindowTab("week", "Week", "task list", "total")],
                                 options=[ToggleOption("flush", "Flush"), ChoiceOption("range", "Range", (("week", "Week"), ("month", "Month")), "week")])]


class WiderNotesModule(NotesModule):
    """The notes module after an upgrade whose board also reads plans."""

    windows = [WindowDeclaration("notes.board", "Notes board", "board.html", WindowLoading.FRAME, skeleton=[SkeletonPart.line()], reads=["task list", "plan list"], runs=["task start"]),
               WindowDeclaration("notes.summary", "Notes summary", "task list", WindowLoading.DOCUMENT, skeleton=[SkeletonPart.line()], reads=["task list"])]


class GrantingNotesModule(NotesModule):
    """The notes module with a board that declares the lines that give rights and change settings."""

    windows = [WindowDeclaration("notes.board", "Notes board", "board.html", WindowLoading.FRAME, skeleton=[SkeletonPart.line()], reads=["task list"],
                                 runs=["window allow", "window trust", "setting make", "setting edit", "viewer-layout save"])]
