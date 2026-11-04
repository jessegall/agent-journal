class SampleMove:
    def move(self, source, target, map, context):
        # @righteous architecture_upgrade_version_four_table_read_outside_a_move
        rows = source.rows("tasks")
        # @sin architecture_upgrade_version_four_source_written
        source.insert(rows)
        # @sin architecture_upgrade_version_four_source_written
        source.connection.execute(rows)
        # @righteous architecture_upgrade_version_four_source_written
        target.insert(rows)
        # @righteous architecture_upgrade_version_four_table_in_sql
        # @sin architecture_core_sql_outside_database_layer
        return "SELECT * FROM users"
