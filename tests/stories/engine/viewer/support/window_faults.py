from engine.module.suite import Suite
from engine.module.module import Module
from engine.viewer.preset_set import PresetSet
from engine.viewer.entrance import Entrance
from engine.viewer.viewer_preset import ViewerPreset
from engine.viewer.layout_shape import tabs
from engine.viewer.window_declaration import WindowDeclaration
from engine.viewer.window_extension import WindowExtension
from engine.enums.window_loading import WindowLoading
from engine.viewer.choice_option import ChoiceOption
from engine.viewer.toggle_option import ToggleOption
from engine.viewer.window_size import WindowSize
from engine.viewer.skeleton_part import SkeletonPart

PATH = "tests.stories.engine.viewer.support.window_faults"
DEPENDENCIES = ["journal.core.tasks", "journal.core.plans", "journal.core.viewer"]


def frame(name: str, entry: str = "board.html", reads: list[str] | None = None, runs: list[str] | None = None, events: list[str] | None = None,
          kit: str = ">=1,<2") -> WindowDeclaration:
    return WindowDeclaration(name, "Board", entry, WindowLoading.FRAME, skeleton=[SkeletonPart.line()], reads=reads or [], runs=runs or [], events=events or [], kit=kit)


class DuplicateWindowModule(Module):
    name = "twice"
    requires_engine = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [frame("twice.board"), frame("twice.board")]


class ForeignNameModule(Module):
    name = "foreign"
    requires_engine = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [frame("other.board")]


class MissingEntryModule(Module):
    name = "missing"
    requires_engine = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [frame("missing.board", entry="absent.html")]


class UnknownReadModule(Module):
    name = "reads"
    requires_engine = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [frame("reads.board", reads=["task fly"])]


class ChatCommandExtensionModule(Module):
    name = "extender"
    requires_engine = ">=5,<6"
    dependencies = [*DEPENDENCIES, "journal.core.messages"]
    window_extensions = [WindowExtension("messages.chat", runs=["task start"])]


class ChatReadExtensionModule(ChatCommandExtensionModule):
    window_extensions = [WindowExtension("messages.chat", reads=["task list"])]


class UnknownRunModule(Module):
    name = "runs"
    requires_engine = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [frame("runs.board", runs=["task list"])]


class UnknownEventModule(Module):
    name = "events"
    requires_engine = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [frame("events.board", reads=["task list"], events=["rocket.launch"])]


class UncoveredEventModule(Module):
    name = "uncovered"
    requires_engine = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [frame("uncovered.board", reads=["task list"], events=["plan.*"])]


class PageWindowModule(Module):
    name = "pages"
    requires_engine = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [WindowDeclaration("pages.board", "Board", "board.html", WindowLoading.COMPONENT, skeleton=[SkeletonPart.line()])]


class NewerKitModule(Module):
    name = "kits"
    requires_engine = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [frame("kits.board", kit=">=2,<3")]


class TwiceOptionModule(Module):
    name = "options"
    requires_engine = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [WindowDeclaration("options.board", "Board", "board.html", WindowLoading.FRAME, skeleton=[SkeletonPart.line()], options=[ToggleOption("flush", "Flush"), ToggleOption("flush", "Flush all")])]


class UnreadShareModule(Module):
    name = "shares"
    requires_engine = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [WindowDeclaration("shares.board", "Board", "board.html", WindowLoading.FRAME, skeleton=[SkeletonPart.line()], reads=["task list"], shared_reads=["plan show id"])]


class UnreadCountModule(Module):
    name = "counts"
    requires_engine = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [WindowDeclaration("counts.board", "Board", "board.html", WindowLoading.FRAME, skeleton=[SkeletonPart.line()], reads=["task list"], count="plan list")]


class UnknownIconModule(Module):
    name = "icons"
    requires_engine = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [WindowDeclaration("icons.board", "Board", "board.html", WindowLoading.FRAME, skeleton=[SkeletonPart.line()], icon="rocket")]  # pyright: ignore[reportArgumentType]


class OutsideChoiceModule(Module):
    name = "choices"
    requires_engine = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [WindowDeclaration("choices.board", "Board", "board.html", WindowLoading.FRAME, skeleton=[SkeletonPart.line()], options=[ChoiceOption("range", "Range", [("week", "Week")], "year")])]


class FlatFloatModule(Module):
    name = "floats"
    requires_engine = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [WindowDeclaration("floats.board", "Board", "board.html", WindowLoading.FRAME, skeleton=[SkeletonPart.line()], float_size=WindowSize(0, 300))]


class BoardPreset(ViewerPreset):
    key, name, text, shape = "board", "Board", "The board", tabs("presets.board")


class ForeignChatPreset(ViewerPreset):
    key, name, text, shape = "chat", "Chat", "The chat", tabs("messages.chat")


class BoardAgainPreset(ViewerPreset):
    key, name, text, shape = "board", "Board again", "The board again", tabs("presets.board")


class ForeignPresets(PresetSet):
    presets = [BoardPreset, ForeignChatPreset, BoardAgainPreset]


class ForeignPresetEntrance(Entrance):
    key = "presets"
    windows = ["presets.board"]
    presets = {"home": ForeignPresets}


class ForeignPresetSuite(Suite):
    name = "presets"
    entrances = [ForeignPresetEntrance]


class ForeignPresetModule(Module):
    name = "presets"
    requires_engine = ">=5,<6"
    dependencies = [*DEPENDENCIES, "journal.core.drivers"]
    windows = [frame("presets.board")]


class NoSkeletonModule(Module):
    name = "bare"
    requires_engine = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [WindowDeclaration("bare.board", "Board", "board.html", WindowLoading.FRAME)]


class ForeignPresetSuiteOfForeignPresetModule(ForeignPresetSuite):
    modules = [ForeignPresetModule]
