from core.base.journal_home import JournalHome
from collections.abc import Sequence
from functools import cached_property
from core.base.module.module_finder import ModuleFinder
from core.base.viewer.window_priority import WindowPriority
from core.base.viewer.window_declaration import WindowDeclaration


class WindowPriorities:
    """The request priorities and queue exemptions declared by modules for their windows."""

    def __init__(self, home: JournalHome) -> None:
        self.finder = ModuleFinder(home)

    @cached_property
    def windows(self) -> tuple[WindowDeclaration, ...]:
        return tuple(window for module in self.finder.modules() for window in module.windows)

    @cached_property
    def declared(self) -> dict[str, WindowPriority]:
        return {window.name: window.request_priority for window in self.windows}

    @cached_property
    def unqueued_lines(self) -> frozenset[tuple[str, ...]]:
        return frozenset(tuple(line.split()[:2]) for window in self.windows if window.unqueued for line in window.reads)

    def window(self, name: str) -> WindowDeclaration | None:
        return next((window for window in self.windows if window.name == name), None)

    def priority(self, window: str) -> WindowPriority:
        return self.declared.get(window, WindowPriority.NORMAL)

    def is_unqueued(self, line: Sequence[str]) -> bool:
        return tuple(line[:2]) in self.unqueued_lines
