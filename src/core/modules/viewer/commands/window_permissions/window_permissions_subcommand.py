from argparse import ArgumentParser, Namespace

from engine.errors.refusal import Refusal
from core.base.registry.registry import Registry
from engine.caller.caller import Caller
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.viewer.commands.support.window_access import WindowAccess
from core.modules.viewer.commands.support.window_allowances import WindowAllowances
from core.modules.viewer.models.enums.window_permission_type import WindowPermissionType


class WindowPermissionsSubcommand(ReadSubcommand[WindowAccess]):
    """`journal window permissions <window> [--environment <name>]`: what you allowed the window and what it
    still asks for."""

    cli_name = "window"
    name = "permissions"
    environment_refusal = "a window's permissions belong to an environment"

    def __init__(self, registry: Registry, allowances: WindowAllowances) -> None:
        self.registry, self.allowances = registry, allowances

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("window")

    def read(self, arguments: Namespace, caller: Caller) -> WindowAccess:
        if not self.registry.has_window(arguments.window):
            raise Refusal(f"no installed module declares the window {arguments.window}", "journal window permissions needs a window of an installed module")
        window = self.registry.window(arguments.window)
        person_id = caller.actor.id
        reads = self.allowances.allowed_lines(person_id, window.name, WindowPermissionType.READS)
        runs = self.allowances.allowed_lines(person_id, window.name, WindowPermissionType.RUNS)
        return WindowAccess(window.name, ", ".join(reads), ", ".join(line for line in window.reads if line not in reads), ", ".join(runs),
                            ", ".join(line for line in window.runs if line not in runs), self.allowances.component_trusted(person_id, window.module))
