from engine.module.model_declaration import ModelDeclaration
from core.modules.reminders.models.reminder import Reminder


class ReminderModelDeclaration(ModelDeclaration):
    """How the module declares Reminder."""

    model = Reminder
    excluded_subcommands = ["make", "edit"]
