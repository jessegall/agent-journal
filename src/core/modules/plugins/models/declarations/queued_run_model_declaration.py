from engine.module.model_declaration import ModelDeclaration
from core.modules.plugins.models.queued_run import QueuedRun
from engine.module.model_declaration import ALL_SUBCOMMANDS


class QueuedRunModelDeclaration(ModelDeclaration):
    """How the module declares QueuedRun."""

    model = QueuedRun
    excluded_subcommands = ALL_SUBCOMMANDS
