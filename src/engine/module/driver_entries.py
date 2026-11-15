from collections.abc import Sequence

from engine.module.module import Module
from engine.module.suite_list import SuiteList
from engine.dotted_path.dotted_path import DottedPath
from engine.registry.driver_entry import DriverEntry
from engine.registry.suite_entry import SuiteEntry
from engine.module.errors.module_error import ModuleError
from engine.module.suite import Suite
from engine.module.task_assigner import TaskAssigner

DRIVERS_MODULE = "journal.core.drivers"


class DriverEntries:
    """The registry entries of the modules' suites and drivers."""

    def suites(self, modules: Sequence[type[Module]], shipped_modules: Sequence[type[Module]], suites: SuiteList) -> tuple[SuiteEntry, ...]:
        return tuple(SuiteEntry(suite.name, module.name, tuple(suite.requires), suite.offered_windows(), suite.default_layouts(), suite.offered_presets(),
                                      self.task_assigner_path(suite), shipped=module in shipped_modules, entrances=suite.entrance_windows())
                     for module in modules for suite in suites.module_suites(module))

    @staticmethod
    def task_assigner_path(suite: type[Suite]) -> str:
        if suite.task_assigner is None:
            return ""
        if not (isinstance(suite.task_assigner, type) and issubclass(suite.task_assigner, TaskAssigner)):
            raise ModuleError(f"the task assigner of suite {suite.name} does not extend TaskAssigner")
        return DottedPath.class_path(suite.task_assigner).text

    def drivers(self, modules: Sequence[type[Module]]) -> tuple[DriverEntry, ...]:
        return tuple(DriverEntry(driver.name, DottedPath.class_path(driver), module.name, driver.suite, driver.agent_type, tuple(driver.instructions))
                     for module in modules for driver in module.suite_drivers())
