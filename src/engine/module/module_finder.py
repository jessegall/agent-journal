from engine.file.file_access import FileAccess
from engine.file.versions.file_version import FileVersion
import json
import sys

from engine.dotted_path.errors.dotted_path_error import DottedPathError

from engine.journal.journal_home import JournalHome
from engine.dotted_path.dotted_path import DottedPath
from engine.module.suite import Suite
from engine.module.module import Module
from engine.module.errors.module_error import ModuleError
from engine.module.suite_list import SuiteList
from engine.module.version_requirement import VersionRequirement
from engine.version.version import CORE_VERSION
from engine.types.type_guards import is_list, is_tuple

DEFAULT_MODULE_LISTS = [DottedPath("core.modules:DEFAULT_MODULES"), DottedPath("suites:DEFAULT_SUITES"), DottedPath("tunnels:DEFAULT_TUNNELS")]


class ModuleFinder:
    """Finds the modules to load: the core's default modules, the modules of the suites and the tunnels shipped
    beside the core, then the plugins the project's modules.json lists, each refused if it needs a core
    version this core is not. A list entry is a module, or a suite, which loads with the modules it lists."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home
        self.plugin_lists: dict[FileVersion, tuple[str, ...]] = {}

    def modules(self) -> tuple[type[Module], ...]:
        plugin_modules = (module for path in self.plugin_paths() for module in self.entry_modules(self.loaded_entry(DottedPath(path)), path))
        return tuple(dict.fromkeys((*self.default_modules(), *plugin_modules)))

    def default_modules(self) -> tuple[type[Module], ...]:
        return tuple(dict.fromkeys(module for path in DEFAULT_MODULE_LISTS for module in self.listed_modules(path)))

    def listed_modules(self, path: DottedPath) -> tuple[type[Module], ...]:
        return tuple(module for item in self.listed_entries(path) for module in self.entry_modules(item, path.text))

    def listed_entries(self, path: DottedPath) -> tuple[object, ...]:
        listed = path.value()
        if not (is_tuple(listed) or is_list(listed)):
            raise ModuleError(f"{path.text} is no list of modules")
        return tuple(listed)

    def entry_modules(self, entry: object, source: str) -> tuple[type[Module], ...]:
        if isinstance(entry, type) and issubclass(entry, Suite):
            return tuple(self.module(module, f"suite {entry.name}") for module in entry.modules)
        return tuple([self.module(entry, source)])

    def suite_list(self) -> SuiteList:
        default_entries = [entry for path in DEFAULT_MODULE_LISTS for entry in self.listed_entries(path)]
        entries = [*default_entries, *(self.loaded_entry(DottedPath(path)) for path in self.plugin_paths())]
        suites = [entry for entry in entries if isinstance(entry, type) and issubclass(entry, Suite)]
        listing = [suite for entry in entries if isinstance(entry, type) and issubclass(entry, Module) for suite in self.listing_suites(entry)]
        return SuiteList([*suites, *listing])

    @staticmethod
    def listing_suites(module: type[Module]) -> list[type[Suite]]:
        """The suites declared beside a listed module, in its own Python file, that list it: a plugin names its
        module in modules.json and the module names no suite."""
        declared = vars(sys.modules[module.__module__]).values()
        return [item for item in declared if isinstance(item, type) and issubclass(item, Suite) and item is not Suite
                and item.__module__ == module.__module__ and module in item.modules]

    def plugin_paths(self) -> tuple[str, ...]:
        if not self.home.module_list.exists():
            return ()
        version = FileAccess.shared().version(self.home.module_list)
        if version in self.plugin_lists:
            return self.plugin_lists[version]
        listed: object = json.loads(FileAccess.shared().read(self.home.module_list))
        if not is_list(listed):
            raise ModuleError(f"{self.home.module_list} must list module paths, such as [\"reviews.module:ReviewsModule\"]")
        paths: list[str] = []
        for item in listed:
            if not isinstance(item, str):
                raise ModuleError(f"{self.home.module_list} lists {item!r}, which is no module path")
            paths.append(item)
        self.plugin_lists = {version: tuple(paths)}
        return self.plugin_lists[version]

    def checked(self, path: DottedPath) -> type[Module]:
        return self.module(self.loaded_entry(path), path.text)

    def loaded_entry(self, path: DottedPath) -> object:
        self.enable_imports()
        try:
            return path.loaded()
        except (ImportError, DottedPathError, SyntaxError) as error:
            raise ModuleError.import_failed(path.text, error) from error

    def enable_imports(self) -> None:
        folder = str(self.home.modules_folder.resolve())
        if folder not in sys.path:
            sys.path.insert(0, folder)

    def module(self, value: object, source: str) -> type[Module]:
        if not isinstance(value, type) or not issubclass(value, Module):
            raise ModuleError(f"{source} names {value!r}, which is no module")
        if not VersionRequirement(value.requires_core).allows(CORE_VERSION):
            raise ModuleError(f"module {value.name} needs core {value.requires_core}, and this core is {'.'.join(map(str, CORE_VERSION))}")
        return value
