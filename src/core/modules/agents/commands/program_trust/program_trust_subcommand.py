from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.enums.hook_trust import HookTrust
from engine.journal.journal_home import JournalHome
from engine.provider.providers import Providers
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand


class ProgramTrustSubcommand(ReadSubcommand[HookTrust]):
    """`journal program trust <program> <folder>`: whether the program runs the journal's hooks, for the
    launcher. The hooks are in the journal's own settings of the program, the same for every folder; the
    launcher still names the folder it starts in."""

    cli_name = "program"
    name = "trust"

    def __init__(self, providers: Providers, home: JournalHome) -> None:
        self.providers, self.home = providers, home

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("program")
        parser.add_argument("folder")

    def read(self, arguments: Namespace, caller: Caller) -> HookTrust:
        return self.providers.provider(arguments.program).journal_trust(self.home)

    def write_output(self, value: object, output: Output) -> None:
        output.line(str(value))
