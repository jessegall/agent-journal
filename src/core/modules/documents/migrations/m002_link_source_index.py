from core.base.database.migration import Migration


class LinkSourceIndexMigration(Migration):
    """What a row links to is found through an index, as each shown row lists its links."""

    number = 2
    statements = tuple(["CREATE INDEX links_source ON links (source_model, source_id, id)"])
