from core.base.driver.suite import Suite
from core.base.module.module import Module
from core.base.viewer.layout_preset import LayoutPreset
from core.base.viewer.layout_shape import tabs
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.choice_option import ChoiceOption
from core.base.viewer.toggle_option import ToggleOption
from core.base.viewer.window_size import WindowSize

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
    windows = [WindowDeclaration("pages.board", "Board", "board.html", WindowLoading.COMPONENT)]


class NewerKitModule(Module):
    name = "kits"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [frame("kits.board", kit=">=2,<3")]


class TwiceOptionModule(Module):
    name = "options"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [WindowDeclaration("options.board", "Board", "board.html", WindowLoading.FRAME, options=[ToggleOption("flush", "Flush"), ToggleOption("flush", "Flush all")])]


class UnreadCountModule(Module):
    name = "counts"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [WindowDeclaration("counts.board", "Board", "board.html", WindowLoading.FRAME, reads=["task list"], count="plan list")]


class UnknownIconModule(Module):
    name = "icons"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [WindowDeclaration("icons.board", "Board", "board.html", WindowLoading.FRAME, icon="rocket")]  # pyright: ignore[reportArgumentType]


class OutsideChoiceModule(Module):
    name = "choices"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [WindowDeclaration("choices.board", "Board", "board.html", WindowLoading.FRAME, options=[ChoiceOption("range", "Range", [("week", "Week")], "year")])]


class FlatFloatModule(Module):
    name = "floats"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [WindowDeclaration("floats.board", "Board", "board.html", WindowLoading.FRAME, float_size=WindowSize(0, 300))]


class ForeignPresetSuite(Suite):
    name = "presets"
    windows = ["presets.board"]
    presets = {"home": [LayoutPreset("board", "Board", "The board", tabs("presets.board")), LayoutPreset("chat", "Chat", "The chat", tabs("messages.chat")),
                        LayoutPreset("board", "Board again", "The board again", tabs("presets.board"))]}


class ForeignPresetModule(Module):
    name = "presets"
    requires_core = ">=5,<6"
    dependencies = [*DEPENDENCIES, "journal.core.drivers"]
    suites = [ForeignPresetSuite]
    windows = [frame("presets.board")]
