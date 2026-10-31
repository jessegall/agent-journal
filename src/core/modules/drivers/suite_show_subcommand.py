from argparse import ArgumentParser, Namespace

from core.base.refusal import Refusal
from core.base.registry.registry import Registry
from core.base.subcommand.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.drivers.suite_description import SuiteDescription


class SuiteShowSubcommand(ReadSubcommand[SuiteDescription]):
    """`journal suite show <suite>`: what it requires, its default driver per role, whether it takes complete
    control, the other modules' overlays it includes, and any of those no installed module ships."""

    cli_name = "suite"
    name = "show"

    def __init__(self, registry: Registry) -> None:
        self.registry = registry

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("suite")

    def read(self, arguments: Namespace, caller: Caller) -> SuiteDescription:
        suite = self.registry.suite(arguments.suite)
        if suite is None:
            raise Refusal(f"no installed module ships suite {arguments.suite}", "journal suite current shows the suite of an environment")
        shipped = {overlay.name for overlay in self.registry.overlays}
        missing = [name for name in suite.included_overlays if name not in shipped]
        return SuiteDescription(suite.name, suite.module, ", ".join(suite.requires), suite.complete_control, ", ".join(suite.included_overlays), ", ".join(missing),
                                ", ".join(f"{role}: {driver}" for role, driver in suite.defaults.items()))
