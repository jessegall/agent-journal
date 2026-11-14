from engine.module.model_declaration import ModelDeclaration
from core.modules.chat.models.journal_exception import JournalException


class JournalExceptionModelDeclaration(ModelDeclaration):
    """How the module declares JournalException."""

    model = JournalException
    excluded_subcommands = ["make", "edit", "delete"]
