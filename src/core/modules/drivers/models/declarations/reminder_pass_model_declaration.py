from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.reminder_pass import ReminderPass


class ReminderPassModelDeclaration(ModelDeclaration):
    """How the module declares ReminderPass."""

    model = ReminderPass
    excluded_subcommands = ["make", "edit", "delete"]
