from typing import TypeVar

from core.base.command.command import Command
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.drivers.models.permission_request import PermissionRequest

PermissionCommand = TypeVar("PermissionCommand", bound=Command[PermissionRequest])


class PermissionRequestSubcommand(Subcommand[PermissionCommand, PermissionRequest]):
    """A subcommand that answers with the permission request it changed."""

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, PermissionRequest):
            output.line(f"permission request {value.id}: {value.state.value}")
