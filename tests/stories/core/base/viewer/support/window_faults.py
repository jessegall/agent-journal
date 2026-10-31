from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_loading import WindowLoading

PATH = "tests.stories.core.base.viewer.support.window_faults"
DEPENDENCIES = ["journal.core.tasks", "journal.core.plans", "journal.core.viewer"]


def frame(name: str, entry: str = "board.html", reads: list[str] | None = None, runs: list[str] | None = None, events: list[str] | None = None,
          kit: str = ">=1,<2") -> WindowDeclaration:
    return WindowDeclaration(name, "Board", entry, WindowLoading.FRAME, reads=reads or [], runs=runs or [], events=events or [], kit=kit)


class DuplicateWindowModule(Module):
    name = "twice"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [frame("twice.board"), frame("twice.board")]


class ForeignNameModule(Module):
    name = "foreign"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [frame("other.board")]


class MissingEntryModule(Module):
    name = "missing"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [frame("missing.board", entry="absent.html")]


class UnknownReadModule(Module):
    name = "reads"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [frame("reads.board", reads=["task fly"])]


class UnknownRunModule(Module):
    name = "runs"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [frame("runs.board", runs=["task list"])]


class UnknownEventModule(Module):
    name = "events"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [frame("events.board", reads=["task list"], events=["rocket.launch"])]


class UncoveredEventModule(Module):
    name = "uncovered"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [frame("uncovered.board", reads=["task list"], events=["plan.*"])]


class PageWindowModule(Module):
    name = "pages"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [WindowDeclaration("pages.board", "Board", "board.html", WindowLoading.PAGE)]


class NewerKitModule(Module):
    name = "kits"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [frame("kits.board", kit=">=2,<3")]
