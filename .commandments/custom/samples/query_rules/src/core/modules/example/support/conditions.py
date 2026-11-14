from engine.database.statement import Statement


def statement():
    # @sin architecture_queries_statement_outside_the_builder
    # @sin architecture_queries_sql_text_in_a_builder
    return Statement("id IN (SELECT id FROM tasks)")


def waiting():
    # @sin architecture_queries_statement_outside_the_builder
    # @sin architecture_queries_sql_text_in_a_builder
    return Statement("closed_at IS NULL")
