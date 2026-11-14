class SampleMove:
    def move(self, source, target, map, context):
        # @righteous architecture_upgrade_version_four_table_read_outside_a_move
        rows = source.rows("tasks")
        # @sin architecture_upgrade_version_four_source_written
        source.insert(rows)
        # @sin architecture_upgrade_version_four_source_written
        # @sin architecture_queries_statement_outside_the_builder
        source.connection.execute(rows)
        # @righteous architecture_upgrade_version_four_source_written
        target.insert(rows)
        # @righteous architecture_upgrade_version_four_table_in_sql
        # @sin architecture_queries_sql_text_in_a_builder
        return "SELECT * FROM users"
