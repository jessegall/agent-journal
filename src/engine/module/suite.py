from collections.abc import Sequence
from typing import TYPE_CHECKING, ClassVar

from engine.viewer.entry_point import EntryPoint
from engine.viewer.layout_preset import LayoutPreset
from engine.viewer.layout_shape import LayoutShape
from engine.helper_type.helper_type import HelperType
from engine.module.task_assigner import TaskAssigner

if TYPE_CHECKING:
    from engine.module.module import Module


class Suite:
    """The base of every suite: a swappable set of drivers above the core, each driving the helper type it
    names, with the modules it lists (its own module first), the suites it requires, its entry points (each
    the viewer windows its environments show, the default layout of each viewer page, per driver where one is
    named, and the layouts it offers per page in the picker) and the kinds of helper it registers. A suite
    that joins another is no suite to pick: a plugin ships one to add its modules to that suite, whose
    environments alone run them, so no module names a suite itself."""

    name: ClassVar[str]
    modules: ClassVar[Sequence[type[Module]]] = []
    joins: ClassVar[str | None] = None
    requires: ClassVar[Sequence[str]] = []
    entry_points: ClassVar[Sequence[type[EntryPoint]]] = []
    task_assigner: ClassVar[type[TaskAssigner] | None] = None
    helper_types: ClassVar[Sequence[type[HelperType]]] = []

    @classmethod
    def offered_windows(cls) -> tuple[str, ...]:
        return tuple(dict.fromkeys(window for entry_point in cls.entry_points for window in entry_point.window_names()))

    # an earlier entry point's layout of a page comes first
    @classmethod
    def default_layouts(cls) -> dict[str, LayoutShape]:
        return {page: layout.shape for entry_point in reversed(cls.entry_points) for page, layout in entry_point.layouts.items()}

    @classmethod
    def offered_presets(cls) -> dict[str, tuple[LayoutPreset, ...]]:
        pages = dict.fromkeys(page for entry_point in cls.entry_points for page in entry_point.presets)
        return {page: tuple(preset for entry_point in cls.entry_points if page in entry_point.presets for preset in entry_point.presets[page].layout_presets()) for page in pages}

    # entry points that share a key are one way in, whose windows several modules declare
    @classmethod
    def entry_point_windows(cls) -> dict[str, tuple[str, ...]]:
        return {key: tuple(dict.fromkeys(name for entry_point in cls.entry_points if entry_point.key == key for name in entry_point.window_names()))
                for key in dict.fromkeys(entry_point.key for entry_point in cls.entry_points)}
