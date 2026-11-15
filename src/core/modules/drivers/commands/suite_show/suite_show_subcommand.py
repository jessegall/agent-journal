from argparse import ArgumentParser, Namespace

from engine.errors.refusal import Refusal
from engine.registry.registry import Registry
from engine.caller.caller import Caller
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.drivers.commands.support.suite_description import SuiteDescription


class SuiteShowSubcommand(ReadSubcommand[SuiteDescription]):
    """`journal suite show <suite>`: the module that ships it, what it requires and its default driver per role."""

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
        return SuiteDescription(suite.name, suite.module, ", ".join(suite.requires),
                                ", ".join(f"{role}: {driver.name}" for role, driver in self.registry.type_drivers(suite).items()))
