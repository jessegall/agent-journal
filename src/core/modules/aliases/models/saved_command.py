from dataclasses import dataclass

from engine.driver.command_category import CommandCategory
from engine.model.view_model import ViewModel
from core.modules.aliases.models.support.views import SAVED_COMMANDS_SELECT


@dataclass(frozen=True, kw_only=True)
class SavedCommand(ViewModel):
    """A saved test or build command shown in settings."""

    cli_name = "saved-command"
    view = "saved_commands"
    key = "id"
    select = SAVED_COMMANDS_SELECT

    id: int
    name: str
    line: str
    category: CommandCategory
