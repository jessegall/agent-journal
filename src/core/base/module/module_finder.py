import json
from typing import TypeIs

from core.base.journal_home import JournalHome
from core.base.module.dotted_path import DottedPath
from core.base.module.module import Module
from core.base.module.module_error import ModuleError
from core.base.module.version_requirement import VersionRequirement
from core.base.version import CORE_VERSION

DEFAULT_MODULES: tuple[str, ...] = ()


def is_list(value: object) -> TypeIs[list[object]]:
    return isinstance(value, list)


class ModuleFinder:
    """Finds the modules to load: the core's default modules, then the plugins the project's modules.json lists,
    each refused if it needs a core version this core is not."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def found(self) -> tuple[type[Module], ...]:
        return tuple(self.checked(DottedPath(path)) for path in DEFAULT_MODULES + self.plugin_paths())

    def plugin_paths(self) -> tuple[str, ...]:
        if not self.home.module_list.exists():
            return ()
        listed: object = json.loads(self.home.module_list.read_text())
        if not is_list(listed):
            raise ModuleError(f"{self.home.module_list} must list module paths, such as [\"reviews.module:ReviewsModule\"]")
        paths: list[str] = []
        for item in listed:
            if not isinstance(item, str):
                raise ModuleError(f"{self.home.module_list} lists {item!r}, which is no module path")
            paths.append(item)
        return tuple(paths)

    def checked(self, path: DottedPath) -> type[Module]:
        module = path.loaded()
        if not issubclass(module, Module):
            raise ModuleError(f"{path.text} is no module")
        if not VersionRequirement(module.requires_core).is_met(CORE_VERSION):
            raise ModuleError(f"module {module.name} needs core {module.requires_core}, and this core is {'.'.join(map(str, CORE_VERSION))}")
        return module
