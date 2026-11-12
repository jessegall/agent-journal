# @sin architecture_layout_helper_in_a_kind_folder
class BadReader:
    def read(self, source, database, Statement):
        # @sin architecture_upgrade_version_four_table_read_outside_a_move
        rows = source.rows("tasks")
        # @sin architecture_upgrade_version_four_table_in_sql
        # @sin architecture_queries_sql_text_in_a_builder
        # @sin architecture_queries_statement_outside_the_builder
        return database.rows(Statement("SELECT * FROM users")), rows
