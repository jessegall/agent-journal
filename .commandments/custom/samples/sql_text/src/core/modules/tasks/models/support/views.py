# @sin architecture_queries_sql_text_in_a_builder
OPEN_TASKS_SELECT = "SELECT id FROM tasks WHERE closed_at IS NULL ORDER BY id"
# @righteous architecture_queries_sql_text_in_a_builder
OPEN_TASKS = Select("tasks").selecting(Column("id")).matching(IsNull("closed_at")).ordered("id", False).view_sql()
