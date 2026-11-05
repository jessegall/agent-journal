from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.settings.commands.scan_managed_hooks.scan_managed_hooks import ScanManagedHooks


class ScanManagedHooksSubcommand(Subcommand[ScanManagedHooks, int]):
    """Scans project files for command hooks to manage."""

    cli_name = "managed-hook"
    name = "scan"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        pass

    def command(self, arguments: Namespace, caller: Caller) -> ScanManagedHooks:
        return ScanManagedHooks()

    def write_output(self, value: object, output: Output) -> None:
        output.line(f"managed hooks: {value}")
