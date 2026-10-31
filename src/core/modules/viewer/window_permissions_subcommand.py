from argparse import ArgumentParser, Namespace

from core.base.environment_names import EnvironmentNames
from core.base.refusal import Refusal
from core.base.registry.registry import Registry
from core.base.subcommand.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.viewer.window_access import WindowAccess
from core.modules.viewer.window_allowances import WindowAllowances
from core.modules.viewer.window_permission_type import WindowPermissionType


class WindowPermissionsSubcommand(ReadSubcommand[WindowAccess]):
    """`journal window permissions <window> [--environment <name>]`: what you allowed the window and what it still
    asks for."""

    cli_name = "window"
    name = "permissions"

    def __init__(self, registry: Registry, allowances: WindowAllowances, environment_names: EnvironmentNames) -> None:
        self.registry, self.allowances, self.environment_names = registry, allowances, environment_names

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("window")
        parser.add_argument("--environment")

    def read(self, arguments: Namespace, caller: Caller) -> WindowAccess:
        if not self.registry.has_window(arguments.window):
            raise Refusal(f"no installed module declares the window {arguments.window}", "journal window permissions needs a window of an installed module")
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        if environment_id is None:
            raise Refusal("a window's permissions belong to an environment", "name one with --environment")
        window = self.registry.window(arguments.window)
        person_id = caller.actor.id
        reads = self.allowances.allowed_lines(person_id, environment_id, window.name, WindowPermissionType.READS)
        runs = self.allowances.allowed_lines(person_id, environment_id, window.name, WindowPermissionType.RUNS)
        return WindowAccess(window.name, ", ".join(reads), ", ".join(line for line in window.reads if line not in reads), ", ".join(runs),
                            ", ".join(line for line in window.runs if line not in runs), self.allowances.page_trusted(person_id, environment_id, window.module))
