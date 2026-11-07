from argparse import ArgumentParser, Namespace
from pathlib import Path

from core.base.caller.caller import Caller
from core.base.provider.hook_trust import HookTrust
from core.base.provider.providers import Providers
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand


class ProgramTrustSubcommand(ReadSubcommand[HookTrust]):
    """`journal program trust <program> <folder>`: whether the program runs the journal's hooks in the folder,
    for the launcher."""

    cli_name = "program"
    name = "trust"

    def __init__(self, providers: Providers) -> None:
        self.providers = providers

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("program")
        parser.add_argument("folder")

    def read(self, arguments: Namespace, caller: Caller) -> HookTrust:
        return self.providers.provider(arguments.program).hook_trust(Path(arguments.folder))

    def write_output(self, value: object, output: Output) -> None:
        output.line(str(value))
