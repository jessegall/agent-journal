from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.provider.managed_hook import ManagedHook
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from engine.types.type_guards import is_list
from core.modules.settings.commands.remove_managed_hooks.remove_managed_hooks import RemoveManagedHooks


class RemoveManagedHooksSubcommand(Subcommand[RemoveManagedHooks, list[ManagedHook]]):
    """`journal managed-hook remove --stamp <text>`: removes the managed hooks whose command carries the stamp."""

    cli_name = "managed-hook"
    name = "remove"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--stamp", required=True)

    def command(self, arguments: Namespace, caller: Caller) -> RemoveManagedHooks:
        return RemoveManagedHooks(arguments.stamp)

    def write_output(self, value: object, output: Output) -> None:
        if is_list(value):
            output.line(f"removed {len(value)} managed hooks")
