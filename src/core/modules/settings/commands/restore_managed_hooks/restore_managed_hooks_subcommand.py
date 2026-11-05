from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.settings.commands.restore_managed_hooks.restore_managed_hooks import RestoreManagedHooks


class RestoreManagedHooksSubcommand(Subcommand[RestoreManagedHooks, int]):
    """Returns managed hooks to their source files until the next scan."""

    cli_name = "managed-hook"
    name = "give-back"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        pass

    def command(self, arguments: Namespace, caller: Caller) -> RestoreManagedHooks:
        return RestoreManagedHooks()

    def write_output(self, value: object, output: Output) -> None:
        output.line(f"restored hooks: {value}. Management is off until the next scan.")
