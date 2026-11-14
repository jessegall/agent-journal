from engine.module.model_declaration import ModelDeclaration
from core.modules.schedules.models.scheduled_job import ScheduledJob


class ScheduledJobModelDeclaration(ModelDeclaration):
    """How the module declares ScheduledJob."""

    model = ScheduledJob
    excluded_subcommands = ["make", "edit", "delete"]
