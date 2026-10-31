from collections.abc import Sequence
from dataclasses import replace

from core.base.driver.driver_rule import DriverRule
from core.base.module.module import Module
from core.base.registry.dotted_path import DottedPath
from core.base.registry.driver_entry import DriverEntry
from core.base.registry.driver_rule_entry import DriverRuleEntry
from core.base.registry.overlay_entry import OverlayEntry
from core.base.registry.suite_entry import SuiteEntry

DRIVERS_MODULE = "journal.core.drivers"


class DriverEntries:
    """The registry entries of the modules' suites, drivers, overlays and driver rules, in sync order: per module,
    each driver's limits and rules, each overlay's rules, then the rules the module adds."""

    def suites(self, modules: Sequence[type[Module]]) -> tuple[SuiteEntry, ...]:
        return tuple(SuiteEntry(suite.name, module.name, tuple(suite.requires), dict(suite.defaults), suite.complete_control, tuple(suite.included_overlays))
                     for module in modules for suite in module.suites)

    def drivers(self, modules: Sequence[type[Module]]) -> tuple[DriverEntry, ...]:
        return tuple(DriverEntry(driver.name, DottedPath.class_path(driver), module.name, driver.suite, driver.role, tuple(driver.opening_lines),
                                 tuple(guard.name for guard in driver.guards))
                     for module in modules for driver in module.drivers)

    def overlays(self, modules: Sequence[type[Module]]) -> tuple[OverlayEntry, ...]:
        overlays = [overlay for module in modules for overlay in module.overlays]
        return tuple(OverlayEntry(overlay.name, DottedPath.class_path(overlay), position, tuple(overlay.drivers)) for position, overlay in enumerate(overlays, 1))

    def rules(self, modules: Sequence[type[Module]]) -> tuple[DriverRuleEntry, ...]:
        declared: list[DriverRuleEntry] = []
        for module in modules:
            for driver in module.drivers:
                declared += [self.entry(rule, driver.name, limit=True) for rule in driver.limits]
                declared += [self.entry(rule, driver.name) for rule in driver.rules]
            for overlay in module.overlays:
                declared += [self.entry(rule, overlay.name) for rule in overlay.rules]
            declared += [self.entry(rule, module.name, essential=rule.essential and module.name == DRIVERS_MODULE) for rule in module.driver_rules]
        return tuple(replace(entry, position=position) for position, entry in enumerate(declared, 1))

    def entry(self, rule: type[DriverRule], owner: str, limit: bool = False, essential: bool = False) -> DriverRuleEntry:
        return DriverRuleEntry(rule.name, DottedPath.class_path(rule), rule.hook, 0, owner, tuple(rule.drivers), tuple(rule.roles), limit, essential, rule.history,
                               rule.essential)
