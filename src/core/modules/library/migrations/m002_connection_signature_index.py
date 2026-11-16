from engine.database.migration import Migration


class ConnectionSignatureIndexMigration(Migration):
    number = 2
    statements = ("CREATE INDEX library_connections_signature ON library_connections (version, updated_at)",)
