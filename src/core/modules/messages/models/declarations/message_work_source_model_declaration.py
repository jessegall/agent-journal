from engine.module.model_declaration import ModelDeclaration
from core.modules.messages.models.message_work_source import MessageWorkSource
from engine.module.model_declaration import ALL_SUBCOMMANDS


class MessageWorkSourceModelDeclaration(ModelDeclaration):
    """How the module declares MessageWorkSource."""

    model = MessageWorkSource
    excluded_subcommands = ALL_SUBCOMMANDS
