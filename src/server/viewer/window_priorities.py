from engine.journal.journal_home import JournalHome
from collections.abc import Sequence
from functools import cached_property
from engine.module.module_finder import ModuleFinder
from engine.module.window_extensions import WindowExtensions
from engine.enums.window_priority import WindowPriority
from engine.viewer.window_declaration import WindowDeclaration


class WindowPriorities:
    """The request priorities and queue exemptions declared by modules for their windows."""

    def __init__(self, home: JournalHome) -> None:
        self.finder = ModuleFinder(home)

    @cached_property
    def windows(self) -> tuple[WindowDeclaration, ...]:
        modules = self.finder.modules()
        extensions = WindowExtensions(modules)
        return tuple(extensions.extend(window) for module in modules for window in module.windows)

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
