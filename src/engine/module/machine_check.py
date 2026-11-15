from collections.abc import Sequence

from engine.module.contribution_reader import ContributionReader
from engine.agent_machine.compiling.declaration_check import DeclarationCheck
from engine.agent_machine.compiling.driver_declaration import DriverDeclaration
from engine.agent_machine.compiling.module_contributions import ModuleContributions
from engine.module.module import Module


class MachineCheck:
    """Sync's check of the agent machine's declarations over the installed modules: every misuse of doc 1310 section
    5.3 that a module's lists can show, each as a problem that names the owner, the declaration and the fix."""

    def __init__(self, reader: ContributionReader) -> None:
        self.reader = reader

    def problems(self, modules: Sequence[type[Module]]) -> list[str]:
        drivers = self.drivers(modules)
        check = DeclarationCheck(drivers, self.contributions(modules), (), sorted({driver.agent_type for driver in drivers}))
        return [finding.text() for finding in check.refusals()]

    def contributions(self, modules: Sequence[type[Module]]) -> list[ModuleContributions]:
        return [self.reader.read(module) for module in modules]

    @staticmethod
    def drivers(modules: Sequence[type[Module]]) -> list[DriverDeclaration]:
        return [DriverDeclaration.described(driver) for module in modules for driver in module.agent_drivers]
