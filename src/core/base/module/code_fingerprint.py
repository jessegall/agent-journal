import hashlib

from core.base.registry.dotted_path import DottedPath
from core.base.module.module import Module
from core.base.version import CORE_VERSION


class CodeFingerprint:
    """A hash of the core version and of every file the modules name, by path, size and change time, so a run
    can tell without importing anything that the registry was built from other code."""

    def text(self, modules: tuple[type[Module], ...]) -> str:
        digest = hashlib.sha256(".".join(map(str, CORE_VERSION)).encode())
        for file in sorted({DottedPath(path).source_file() for module in modules for path in self.module_paths(module)}):
            status = file.stat()
            digest.update(f"{file}:{status.st_size}:{status.st_mtime_ns}".encode())
        return digest.hexdigest()

    def module_paths(self, module: type[Module]) -> tuple[str, ...]:
        declared_paths = (*module.migrations, *module.views, *module.handlers, *module.subcommands, *module.guards, *module.listeners)
        nouns = tuple(DottedPath.class_path(noun.model).text for noun in module.nouns)
        return (DottedPath.class_path(module).text, *nouns, *declared_paths)
