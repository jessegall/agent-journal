from engine.database.migration import Migration


class TaskSampleMigration(Migration):
    number = 99
    # @righteous architecture_queries_sql_text_in_a_builder
    statements = ["UPDATE tasks SET priority = 'normal' WHERE priority IS NULL"]
