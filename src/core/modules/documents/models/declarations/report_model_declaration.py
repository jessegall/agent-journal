from engine.module.model_declaration import ModelDeclaration
from core.modules.documents.models.report import Report
from engine.module.model_declaration import ALL_SUBCOMMANDS


class ReportModelDeclaration(ModelDeclaration):
    """How the module declares Report."""

    model = Report
    excluded_subcommands = ALL_SUBCOMMANDS
