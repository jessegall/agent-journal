from collections.abc import Sequence

from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration


class WindowExtensions:
    """Combines the installed modules' extensions with a window declaration."""

    def __init__(self, modules: Sequence[type[Module]]) -> None:
        self.extensions = tuple(extension for module in modules for extension in module.window_extensions)

    def extend(self, declaration: WindowDeclaration) -> WindowDeclaration:
        for extension in self.extensions:
            if extension.window != declaration.name:
                continue
            declaration = extension.extend(declaration)
        return declaration
