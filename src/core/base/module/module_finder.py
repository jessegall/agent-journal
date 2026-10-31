import json

from core.base.journal_home import JournalHome
from core.base.registry.dotted_path import DottedPath
from core.base.module.module import Module
from core.base.module.module_error import ModuleError
from core.base.module.version_requirement import VersionRequirement
from core.base.version import CORE_VERSION
from core.base.type_guards import is_list, is_tuple

DEFAULT_MODULE_LISTS = [DottedPath("core.modules:DEFAULT_MODULES"), DottedPath("suites:DEFAULT_SUITES"), DottedPath("tunnels:DEFAULT_TUNNELS")]


class ModuleFinder:
    """Finds the modules to load: the core's default modules, the suites and the tunnels shipped beside the
    core, then the plugins the project's modules.json lists, each refused if it needs a core version this
    core is not."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def modules(self) -> tuple[type[Module], ...]:
        return (*self.default_modules(), *(self.checked(DottedPath(path)) for path in self.plugin_paths()))

    def default_modules(self) -> tuple[type[Module], ...]:
        return tuple(module for path in DEFAULT_MODULE_LISTS for module in self.listed_modules(path))

    def listed_modules(self, path: DottedPath) -> tuple[type[Module], ...]:
        listed = path.value()
        if not is_tuple(listed):
            raise ModuleError(f"{path.text} is no tuple of modules")
        return tuple(self.module(item, path.text) for item in listed)

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
        return self.module(path.loaded(), path.text)

    def module(self, value: object, source: str) -> type[Module]:
        if not isinstance(value, type) or not issubclass(value, Module):
            raise ModuleError(f"{source} names {value!r}, which is no module")
        if not VersionRequirement(value.requires_core).allows(CORE_VERSION):
            raise ModuleError(f"module {value.name} needs core {value.requires_core}, and this core is {'.'.join(map(str, CORE_VERSION))}")
        return value
