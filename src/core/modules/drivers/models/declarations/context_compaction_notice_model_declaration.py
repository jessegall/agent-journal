from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.context_compaction_notice import ContextCompactionNotice


class ContextCompactionNoticeModelDeclaration(ModelDeclaration):
    """How the module declares ContextCompactionNotice."""

    model = ContextCompactionNotice
    excluded_subcommands = ["make", "edit", "delete"]
