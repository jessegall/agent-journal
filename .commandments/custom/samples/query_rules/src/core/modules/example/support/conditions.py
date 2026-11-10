from engine.database.statement import Statement


def statement():
    # @sin architecture_queries_sql_condition_outside_conditions
    # @sin architecture_core_sql_outside_database_layer
    return Statement("id IN (SELECT id FROM tasks)")


def waiting():
    # @sin architecture_core_sql_outside_database_layer
    return Statement("closed_at IS NULL")
