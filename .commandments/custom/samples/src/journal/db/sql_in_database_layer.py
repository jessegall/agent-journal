# @righteous SqlOutsideDatabaseLayerDetector
text = f"SELECT {selection} FROM {self.table}{filters.text}"
# @righteous SqlOutsideDatabaseLayerDetector
connection.execute("CREATE INDEX IF NOT EXISTS links_by_source ON links (source)")
