from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.provider.managed_hook import ManagedHook
from core.base.provider.managed_state import ManagedState
from core.base.subcommand.subcommand import Subcommand
from core.modules.settings.commands.set_managed_hook.set_managed_hook import SetManagedHook


class SetManagedHookSubcommand(Subcommand[SetManagedHook, ManagedHook]):
    """Sets a managed project hook's state and timeout."""

    cli_name = "managed-hook"
    name = "set"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("hook_id")
        parser.add_argument("state", type=ManagedState, choices=list(ManagedState))
        parser.add_argument("timeout", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> SetManagedHook:
        return SetManagedHook(arguments.hook_id, arguments.state, arguments.timeout)
