from engine.module.model_declaration import ModelDeclaration
from core.modules.processes.models.reading_decision_row import ReadingDecisionRow
from core.modules.processes.queries.reading_decision_query import ReadingDecisionQuery


class ReadingDecisionRowModelDeclaration(ModelDeclaration):
    """How the module declares ReadingDecisionRow."""

    model = ReadingDecisionRow
    query = ReadingDecisionQuery
    excluded_subcommands = ["make", "edit", "delete"]
