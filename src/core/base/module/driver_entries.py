from collections.abc import Sequence
from dataclasses import replace

from core.base.driver.driver_rule import DriverRule
from core.base.module.module import Module
from core.base.dotted_path.dotted_path import DottedPath
from core.base.registry.driver_entry import DriverEntry
from core.base.registry.driver_rule_entry import DriverRuleEntry
from core.base.registry.overlay_entry import OverlayEntry
from core.base.registry.suite_entry import SuiteEntry

DRIVERS_MODULE = "journal.core.drivers"


class DriverEntries:
    """The registry entries of the modules' suites, drivers, overlays and driver rules, in sync order: per
    module, each driver's rules, each overlay's rules, then the rules the module adds."""

    def suites(self, modules: Sequence[type[Module]], shipped_modules: Sequence[type[Module]]) -> tuple[SuiteEntry, ...]:
        return tuple(SuiteEntry(suite.name, module.name, tuple(suite.requires), {str(role): driver for role, driver in suite.defaults.items()}, suite.complete_control, tuple(suite.included_overlays),
                                      tuple(suite.windows), dict(suite.layouts), {page: tuple(presets) for page, presets in suite.presets.items()},
                                      suite.agent_policy,
                                      DottedPath.class_path(suite.task_assigner).text if suite.task_assigner else "", shipped=module in shipped_modules)
                     for module in modules for suite in module.suites)

    def drivers(self, modules: Sequence[type[Module]]) -> tuple[DriverEntry, ...]:
        return tuple(DriverEntry(driver.name, DottedPath.class_path(driver), module.name, driver.suite.name, driver.role, tuple(driver.opening_lines),
                                 tuple(guard.name for guard in driver.guards))
                     for module in modules for driver in module.drivers)

    def overlays(self, modules: Sequence[type[Module]]) -> tuple[OverlayEntry, ...]:
        overlays = [overlay for module in modules for overlay in module.overlays]
        return tuple(OverlayEntry(overlay.name, DottedPath.class_path(overlay), position, tuple(overlay.drivers)) for position, overlay in enumerate(overlays, 1))

    def rules(self, modules: Sequence[type[Module]]) -> tuple[DriverRuleEntry, ...]:
        declared: list[DriverRuleEntry] = []
        for module in modules:
            for driver in module.drivers:
                declared += [self.entry(rule, driver.name, exempt=rule.exempt) for rule in driver.rules]
            for overlay in module.overlays:
                declared += [self.entry(rule, overlay.name) for rule in overlay.rules]
            declared += [self.entry(rule, module.name, essential=rule.essential and module.name == DRIVERS_MODULE) for rule in module.driver_rules]
        return tuple(replace(entry, position=position) for position, entry in enumerate(sorted(declared, key=lambda entry: entry.priority), 1))

    def entry(self, rule: type[DriverRule], owner: str, exempt: bool = False, essential: bool = False) -> DriverRuleEntry:
        return DriverRuleEntry(rule.name, DottedPath.class_path(rule), rule.hook, 0, owner, tuple(rule.drivers), tuple(rule.roles), exempt, essential, rule.history,
                               rule.essential, rule.role_group, rule.priority)
