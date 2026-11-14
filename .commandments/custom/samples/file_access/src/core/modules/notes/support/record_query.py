class RecordQuery:
    def open(self):
        return []


def open_rows(query: RecordQuery):
    # @righteous FileReadsDetector
    return query.open()
