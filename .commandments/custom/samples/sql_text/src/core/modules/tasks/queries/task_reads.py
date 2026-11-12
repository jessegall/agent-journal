from engine.query.conditions.equal import Equal

# @sin architecture_queries_sql_text_in_a_builder
NAMED = "name = ?"
# @sin architecture_queries_sql_text_in_a_builder
AMONG = "id IN (1, 2)"
# @sin architecture_queries_sql_text_in_a_builder
WAITING = "EXISTS(SELECT 1 FROM task_waits)"
# @sin architecture_queries_sql_text_in_a_builder
JOINED = "tasks JOIN agents ON agents.id = tasks.holder_id"
# @sin architecture_queries_sql_text_in_a_builder
GROUPED = "state, count(*) GROUP BY state"
# @sin architecture_queries_sql_text_in_a_builder
ORDERED = "id ORDER BY priority DESC"
# @sin architecture_queries_sql_text_in_a_builder
LIMITED = "id LIMIT 5"
# @sin architecture_queries_sql_text_in_a_builder
# @sin architecture_core_sql_outside_database_layer
SELECTED = "SELECT id FROM tasks"
# @sin architecture_queries_sql_text_in_a_builder
UNHELD = "holder_id IS NULL"
# @righteous architecture_queries_sql_text_in_a_builder
PICK = "select a task to start"
# @righteous architecture_queries_sql_text_in_a_builder
SORT = "order by priority, then by age"
# @righteous architecture_queries_sql_text_in_a_builder
PLACED = "a task is in the plan"


def held(query, holder_id):
    # @righteous architecture_queries_sql_text_in_a_builder
    # @righteous architecture_queries_statement_outside_the_builder
    return query.matching(Equal("holder_id", holder_id)).take(5)


def described(database):
    # @sin architecture_queries_statement_outside_the_builder
    return database.connection.execute("PRAGMA table_info(tasks)").fetchall()
