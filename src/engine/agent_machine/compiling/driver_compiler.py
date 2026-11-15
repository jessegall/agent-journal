from collections.abc import Sequence
from graphlib import TopologicalSorter

from engine.agent_machine.compiling.contribution_declaration import ContributionDeclaration
from engine.agent_machine.compiling.module_contributions import ModuleContributions
from engine.agent_machine.compiling.driver_declaration import DriverDeclaration
from engine.agent_machine.compiling.driver_table import DriverTable
from engine.enums.contribution_type import ContributionType


class DriverCompiler:
    """Compiles one table per driver: every contribution of the included modules that applies to its agent
    type or to a type of a driver it gathers, sorted per list by the driver's rank order, then module
    dependency order, then key."""

    def __init__(self, modules: Sequence[ModuleContributions]) -> None:
        self.modules = modules
        self.module_order = {module.name: place for place, module in enumerate(self.dependency_order())}

    def tables(self, drivers: Sequence[DriverDeclaration]) -> list[DriverTable]:
        driver_index = {driver.name: driver for driver in drivers}
        return [self.table(driver, {driver.agent_type, *(driver_index[name].agent_type for name in driver.gathers if name in driver_index)}) for driver in drivers]

    def table(self, driver: DriverDeclaration, agent_types: set[str]) -> DriverTable:
        entries = [(module.name, entry) for module in self.modules for entry in module.contributions if any(entry.covers(agent_type) for agent_type in agent_types)]
        ordered = sorted(entries, key=lambda pair: (list(ContributionType).index(pair[1].contribution_type), self.rank_place(driver, pair[1]), self.module_order[pair[0]], pair[1].key))
        return DriverTable(driver.name, driver.agent_type, tuple(ordered))

    @staticmethod
    def rank_place(driver: DriverDeclaration, entry: ContributionDeclaration) -> int:
        return driver.rank_order.place(entry.rank)

    def dependency_order(self) -> list[ModuleContributions]:
        names = {module.name: module for module in self.modules}
        graph = {module.name: [name for name in module.dependencies if name in names] for module in self.modules}
        return [names[name] for name in TopologicalSorter(graph).static_order()]
