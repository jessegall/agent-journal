from engine.database.migration import Migration


class ProcessPartTextIndexMigration(Migration):
    """A hook asks whether a part of its line went past the limit before, so a part's text is indexed."""

    number = 15
    statements = tuple(["CREATE INDEX process_parts_text ON process_parts (text)"])
