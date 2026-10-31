class BadReader:
    def read(self, source, database, Statement):
        # @sin architecture_upgrade_MovesDeclaredByModulesDetector
        rows = source.rows("tasks")
        # @sin architecture_upgrade_NoDirectOldTableSqlDetector
        return database.rows(Statement("SELECT * FROM users")), rows
