from engine.database.statement import Statement
from engine.query.conditions.is_null import IsNull


class UnheldTask:
    """Matches the tasks nobody holds."""

    def statement(self) -> Statement:
        # @sin architecture_queries_statement_outside_the_builder
        # @sin architecture_queries_sql_text_in_a_builder
        # @sin architecture_core_sql_outside_database_layer
        return Statement("holder_id IS NULL")

    def composed(self) -> Statement:
        # @righteous architecture_queries_statement_outside_the_builder
        return IsNull("holder_id").statement()
