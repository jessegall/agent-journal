from engine.module.model_declaration import ModelDeclaration
from core.modules.accounts.models.audit_entry import AuditEntry
from core.modules.accounts.support.hidden_subcommands import HIDDEN_SUBCOMMANDS


class AuditEntryModelDeclaration(ModelDeclaration):
    """How the module declares AuditEntry."""

    model = AuditEntry
    excluded_subcommands = HIDDEN_SUBCOMMANDS
