# @sin architecture_layout_helper_in_a_kind_folder
class BadReader:
    def read(self, source, database, Statement):
        # @sin architecture_upgrade_version_four_table_read_outside_a_move
        rows = source.rows("tasks")
        # @sin architecture_upgrade_version_four_table_in_sql
        # @sin architecture_core_sql_outside_database_layer
        return database.rows(Statement("SELECT * FROM users")), rows
