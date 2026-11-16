from typing import TypeVar

from engine.command.command import Command
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.drivers.models.driver_grant import DriverGrant

PermissionCommand = TypeVar("PermissionCommand", bound=Command[DriverGrant])


class ChangePermissionRequestSubcommand(Subcommand[PermissionCommand, DriverGrant]):
    """A subcommand that answers with the permission request it changed."""

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, DriverGrant):
            output.line(f"permission request {value.id}: {value.grant_state.value}")
