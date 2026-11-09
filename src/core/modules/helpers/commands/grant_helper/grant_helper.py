from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.helpers.models.helper_grant import HelperGrant


@dataclass(frozen=True)
class GrantHelper(Command[HelperGrant]):
    """Says what one helper may run; a later grant for the same program replaces the earlier one."""

    helper_id: int
    program: str
    subcommands: str
    arguments: str
