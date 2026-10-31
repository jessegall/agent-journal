# @sin architecture_layout_KindFoldersHoldTheirKindDetector
class BadReader:
    def read(self, source, database, Statement):
        # @sin architecture_upgrade_MovesDeclaredByModulesDetector
        rows = source.rows("tasks")
        # @sin architecture_upgrade_NoDirectOldTableSqlDetector
        # @sin architecture_core_SqlLayerDetector
        return database.rows(Statement("SELECT * FROM users")), rows
