from dataclasses import dataclass

from core.base.module.module import Module
from core.base.module.module_finder import ModuleFinder
from core.base.module.module_order import ModuleOrder
from core.base.seed.seeder import Seeder


@dataclass(frozen=True)
class Seeding:
    """One module's seeder, with the module it belongs to."""

    module: str
    seeder: type[Seeder]


class DemoOrder:
    """The seeders of the installed modules in the order they run: every module after the ones it depends on,
    and a seeder after the modules it names to follow."""

    def __init__(self, finder: ModuleFinder, order: ModuleOrder) -> None:
        self.finder, self.order = finder, order

    def seedings(self) -> list[Seeding]:
        modules = self.order.ordered(self.finder.modules())
        pending = [Seeding(module.name, seeder) for module in modules for seeder in self.module_seeders(module)]
        placed: list[Seeding] = []
        while pending:
            names = {seeding.module for seeding in placed}
            waiting = {seeding.module for seeding in pending}
            ready = next((seeding for seeding in pending if all(name in names or name not in waiting for name in seeding.seeder.follows)), pending[0])
            pending.remove(ready)
            placed.append(ready)
        return placed

    @staticmethod
    def module_seeders(module: type[Module]) -> list[type[Seeder]]:
        return list(module.seeders)
