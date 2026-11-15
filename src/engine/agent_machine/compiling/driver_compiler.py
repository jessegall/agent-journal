from collections.abc import Sequence

from engine.agent_machine.compiling.contribution_declaration import ContributionDeclaration
from engine.agent_machine.compiling.declared_module import DeclaredModule
from engine.agent_machine.compiling.driver_declaration import DriverDeclaration
from engine.agent_machine.compiling.driver_table import DriverTable
from engine.enums.contribution_kind import ContributionKind


class DriverCompiler:
    """Compiles one table per driver: every contribution of the included modules that applies to its agent type or to
    a type of a driver it gathers, sorted per list by the driver's rank order, then module dependency order, then key."""

    def __init__(self, modules: Sequence[DeclaredModule]) -> None:
        self.modules = modules
        self.module_order = {module.name: place for place, module in enumerate(self.dependency_order())}

    def tables(self, drivers: Sequence[DriverDeclaration]) -> list[DriverTable]:
        by_name = {driver.name: driver for driver in drivers}
        return [self.table(driver, {driver.agent_type, *(by_name[name].agent_type for name in driver.gathers if name in by_name)}) for driver in drivers]

    def table(self, driver: DriverDeclaration, agent_types: set[str]) -> DriverTable:
        entries = [(module.name, entry) for module in self.modules for entry in module.contributions if any(entry.applies_to(agent_type) for agent_type in agent_types)]
        ordered = sorted(entries, key=lambda pair: (list(ContributionKind).index(pair[1].kind), self.rank_place(driver, pair[1]), self.module_order[pair[0]], pair[1].key))
        return DriverTable(driver.name, driver.agent_type, tuple(ordered))

    @staticmethod
    def rank_place(driver: DriverDeclaration, entry: ContributionDeclaration) -> int:
        return driver.rank_order.place(entry.rank)

    def dependency_order(self) -> list[DeclaredModule]:
        placed: list[DeclaredModule] = []
        remaining = list(self.modules)
        while remaining:
            names = {module.name for module in placed}
            ready = [module for module in remaining if set(module.dependencies) <= names | {module.name} or not set(module.dependencies) & {other.name for other in remaining}]
            placed += ready or remaining[:1]
            remaining = [module for module in remaining if module not in placed]
        return placed
