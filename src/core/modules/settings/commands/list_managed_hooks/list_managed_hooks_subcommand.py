from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.settings.support.project_hook_list import ProjectHookList
from core.modules.settings.support.project_hooks import ProjectHooks


class ListManagedHooksSubcommand(ReadSubcommand[ProjectHookList]):
    """Lists the project's managed hooks, recent outcomes and pending native entries."""

    cli_name = "managed-hook"
    name = "list"

    def __init__(self, hooks: ProjectHooks) -> None:
        self.hooks = hooks

    def arguments(self, parser: ArgumentParser) -> None:
        pass

    def read(self, arguments: Namespace, caller: Caller) -> ProjectHookList:
        return self.hooks.listed()
