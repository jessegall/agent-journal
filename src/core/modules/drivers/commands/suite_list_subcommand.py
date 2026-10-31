from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.registry.registry import Registry
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand


class SuiteListSubcommand(ReadSubcommand[tuple[str, ...]]):
    """`journal suite list`: the installed top suites, one per line, for the launcher's boot menu."""

    cli_name = "suite"
    name = "list"

    def __init__(self, registry: Registry) -> None:
        self.registry = registry

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> tuple[str, ...]:
        return tuple(sorted(suite.name for suite in self.registry.top_suites()))

    def write_output(self, value: object, output: Output) -> None:
        for name in value if isinstance(value, tuple) else ():
            output.line(str(name))
