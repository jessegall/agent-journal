# @sin SqlOutsideDatabaseLayerDetector
rows = self.selected("state = ? ORDER BY id", (state,))
# @sin SqlOutsideDatabaseLayerDetector
row = self.connection.one("SELECT 1 AS found FROM migrated_rows WHERE source = ?", (source,))
# @sin SqlOutsideDatabaseLayerDetector
self.connection.execute(f"DELETE FROM {self.table} WHERE id <= ?", (newest,))
# @sin SqlOutsideDatabaseLayerDetector
count = self.count("closed_at IS NULL")
# @sin SqlOutsideDatabaseLayerDetector
lines = self.selected("kind = 'nudge' AND json_extract(data, '$.session') = ?", (session,))
# @sin SqlOutsideDatabaseLayerDetector
values = self.connection.execute(f"UPDATE {self.table} SET {assignments} WHERE id = ?", params)
# @righteous SqlOutsideDatabaseLayerDetector
rows = self.selected(self.query().filter(state=state).order("id"))
# @righteous SqlOutsideDatabaseLayerDetector
lines = self.selected(self.lines(session).filter_json("data->key", key).order_descending("id").limit(1))
# @righteous SqlOutsideDatabaseLayerDetector
label = "Select a task from the list"
# @righteous SqlOutsideDatabaseLayerDetector
notice = "is the order by name or by time?"
# @righteous SqlOutsideDatabaseLayerDetector
question = "Which plan is in hand?"
# @sin SqlOutsideDatabaseLayerDetector
checks = self.newest("wait_target = 0 AND is_retired = 0", ())
# @righteous SqlOutsideDatabaseLayerDetector
line = "a = b, and the rest"
