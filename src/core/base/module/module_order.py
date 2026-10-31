from core.base.module.module import Module
from core.base.module.module_error import ModuleError


class ModuleOrder:
    """Puts modules in the order of what they depend on, every module after the ones it builds on."""

    def ordered(self, modules: tuple[type[Module], ...]) -> tuple[type[Module], ...]:
        module_index = {module.name: module for module in modules}
        for module in modules:
            missing = [name for name in module.depends_on if name not in module_index]
            if missing:
                raise ModuleError(f"module {module.name} depends on {', '.join(missing)}, which is not installed")
        placed: list[type[Module]] = []
        for module in sorted(modules, key=lambda module: module.name):
            self.place(module, module_index, placed, ())
        return tuple(placed)

    def place(self, module: type[Module], module_index: dict[str, type[Module]], placed: list[type[Module]], path: tuple[str, ...]) -> None:
        if module in placed:
            return
        if module.name in path:
            raise ModuleError(f"modules depend on one another in a loop: {' > '.join((*path, module.name))}")
        for name in sorted(module.depends_on):
            self.place(module_index[name], module_index, placed, (*path, module.name))
        placed.append(module)
