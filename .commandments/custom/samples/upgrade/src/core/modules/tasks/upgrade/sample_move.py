class SampleMove:
    def move(self, source, target, map, context):
        # @righteous architecture_upgrade_MovesDeclaredByModulesDetector
        rows = source.rows("tasks")
        # @sin architecture_upgrade_SourceReadOnlyDetector
        source.insert(rows)
        # @sin architecture_upgrade_SourceReadOnlyDetector
        source.connection.execute(rows)
        # @righteous architecture_upgrade_SourceReadOnlyDetector
        target.insert(rows)
        # @righteous architecture_upgrade_NoDirectOldTableSqlDetector
        # @sin architecture_core_SqlLayerDetector
        return "SELECT * FROM users"
