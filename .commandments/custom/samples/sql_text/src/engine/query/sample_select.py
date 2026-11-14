from engine.database.statement import Statement


def counted(table: str) -> Statement:
    # @righteous architecture_queries_sql_text_in_a_builder
    # @righteous architecture_queries_statement_outside_the_builder
    return Statement(f"SELECT count(*) FROM {table} WHERE id > ?", [0])
