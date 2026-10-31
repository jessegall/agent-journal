from argparse import ArgumentParser, Namespace

from core.base.driver.essential_allowances import EssentialAllowances
from core.base.refusal import Refusal
from core.base.registry.driver_rule_entry import DriverRuleEntry
from core.base.registry.registry import Registry
from core.base.caller.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.drivers.commands.support.driver_description import DriverDescription


class DriverShowSubcommand(ReadSubcommand[DriverDescription]):
    """`journal driver show <driver>`: the standing rules, the overlays' rules and the driver's own and added rules
    that can apply to it, a rule marked essential but not yet allowed named as waiting for the user."""

    cli_name = "driver"
    name = "show"

    def __init__(self, registry: Registry, allowances: EssentialAllowances) -> None:
        self.registry, self.allowances = registry, allowances

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("driver")

    def read(self, arguments: Namespace, caller: Caller) -> DriverDescription:
        driver = self.registry.driver(arguments.driver)
        if driver is None:
            raise Refusal(f"no installed module ships driver {arguments.driver}", "journal suite show <name> lists a suite's drivers")
        rules = sorted(self.registry.rules, key=lambda rule: rule.position)
        standing = [rule.name for rule in rules if rule.is_driver_standing_rule(driver.name)]
        overlays = [f"{rule.name} ({rule.owner})" for rule in rules for overlay in self.registry.driver_overlays(driver.name) if rule.owner == overlay.name]
        added = [self.label(rule) for rule in rules if not rule.essential and not rule.permanent and rule.covers_driver(driver.name, driver.role)]
        return DriverDescription(driver.name, driver.suite, driver.role, ", ".join(standing), ", ".join(overlays), ", ".join(added))

    def label(self, rule: DriverRuleEntry) -> str:
        return f"{rule.name}: essential, waiting for the user" if rule.claims_essential and not self.allowances.allowed(rule.name) else rule.name
