from engine.database.migration import Migration


class ConnectionSignatureIndexMigration(Migration):
    number = 2
    statements = tuple(["CREATE INDEX library_connections_signature ON library_connections (version, updated_at)"])
