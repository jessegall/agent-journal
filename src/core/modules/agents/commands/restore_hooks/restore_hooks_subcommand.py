from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.agents.commands.restore_hooks.restore_hooks import RestoreHooks


class RestoreHooksSubcommand(Subcommand[RestoreHooks, int]):
    """Returns managed project hooks to their source files."""

    cli_name = "hooks"
    name = "give-back"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        pass

    def command(self, arguments: Namespace, caller: Caller) -> RestoreHooks:
        return RestoreHooks()

    def write_output(self, value: object, output: Output) -> None:
        output.line(f"restored hooks: {value}")
