from collections.abc import Mapping, Sequence

from engine.module.module import Module
from engine.module.module_error import ModuleError


class ModuleOrder:
    """Puts modules in the order of what they depend on, every module after the ones it builds on."""

    def ordered(self, modules: tuple[type[Module], ...]) -> tuple[type[Module], ...]:
        module_index = {module.name: module for module in modules}
        for module in modules:
            missing = [name for name in module.dependencies if name not in module_index]
            if missing:
                raise ModuleError(f"module {module.name} depends on {', '.join(missing)}, which is not installed")
        names = self.ordered_names({module.name: module.dependencies for module in modules})
        return tuple(module_index[name] for name in names)

    def ordered_names(self, dependencies: Mapping[str, Sequence[str]]) -> list[str]:
        placed: list[str] = []
        for name in sorted(dependencies):
            self.place(name, dependencies, placed, ())
        return placed

    def place(self, name: str, dependencies: Mapping[str, Sequence[str]], placed: list[str], path: tuple[str, ...]) -> None:
        if name in placed:
            return
        if name in path:
            raise ModuleError(f"modules depend on one another in a loop: {' > '.join((*path, name))}")
        for dependency in sorted(dependencies[name]):
            self.place(dependency, dependencies, placed, (*path, name))
        placed.append(name)
