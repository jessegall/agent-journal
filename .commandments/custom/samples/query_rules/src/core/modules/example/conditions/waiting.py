from engine.database.statement import Statement


def statement():
    # @righteous architecture_queries_sql_condition_outside_conditions
    # @righteous architecture_core_sql_outside_database_layer
    return Statement("id IN (SELECT id FROM tasks)")
