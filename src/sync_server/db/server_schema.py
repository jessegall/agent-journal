MIGRATIONS = (
    """
    CREATE TABLE accounts (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL, role TEXT NOT NULL, password_hash TEXT NOT NULL, created_at REAL NOT NULL);
    CREATE TABLE devices (id INTEGER PRIMARY KEY AUTOINCREMENT, account_id INTEGER NOT NULL, name TEXT NOT NULL, token_hash TEXT NOT NULL UNIQUE, created_at REAL NOT NULL, revoked_at REAL NOT NULL DEFAULT 0);
    CREATE TABLE failed_logins (id INTEGER PRIMARY KEY AUTOINCREMENT, address TEXT NOT NULL, failed_at REAL NOT NULL);
    CREATE INDEX failed_logins_by_address ON failed_logins (address, failed_at);
    CREATE TABLE changes (sequence INTEGER PRIMARY KEY AUTOINCREMENT, row_table TEXT NOT NULL, row INTEGER NOT NULL, action TEXT NOT NULL, fields TEXT NOT NULL, changed_at TEXT NOT NULL, actor TEXT NOT NULL, account_id INTEGER NOT NULL, device_id INTEGER NOT NULL);
    CREATE TABLE rows (row_table TEXT NOT NULL, row INTEGER NOT NULL, fields TEXT NOT NULL, changed_at TEXT NOT NULL, is_deleted INTEGER NOT NULL DEFAULT 0, sequence INTEGER NOT NULL, PRIMARY KEY (row_table, row));
    CREATE TABLE id_blocks (id INTEGER PRIMARY KEY AUTOINCREMENT, device_id INTEGER NOT NULL, row_table TEXT NOT NULL, first_number INTEGER NOT NULL, last_number INTEGER NOT NULL);
    CREATE TABLE id_floors (row_table TEXT PRIMARY KEY, highest INTEGER NOT NULL);
    """,
    """
    ALTER TABLE devices ADD COLUMN pulled_sequence INTEGER NOT NULL DEFAULT 0;
    """,
    """
    ALTER TABLE rows ADD COLUMN writers TEXT NOT NULL DEFAULT '{}';
    """,
    """
    CREATE TABLE push_results (device_id INTEGER NOT NULL, local_number INTEGER NOT NULL, sequence INTEGER NOT NULL, rejected TEXT NOT NULL, PRIMARY KEY (device_id, local_number));
    """,
    """
    ALTER TABLE accounts ADD COLUMN removed_at REAL NOT NULL DEFAULT 0;
    CREATE TABLE invitations (id INTEGER PRIMARY KEY AUTOINCREMENT, code_hash TEXT NOT NULL UNIQUE, email TEXT NOT NULL, created_at REAL NOT NULL, expires_at REAL NOT NULL, used_at REAL NOT NULL DEFAULT 0);
    """,
    """
    CREATE TABLE team_details (name TEXT PRIMARY KEY, value TEXT NOT NULL);
    """,
)


class ServerSchema:
    """The team server's tables, built by numbered migrations of its own, the version kept in the database so an upgraded image migrates it once."""

    def __init__(self, store) -> None:
        self.store = store

    def migrated(self) -> int:
        self.store.script("CREATE TABLE IF NOT EXISTS schema_version (number INTEGER NOT NULL)")
        version = self.version()
        for number, script in enumerate(MIGRATIONS[version:], start=version + 1):
            with self.store.transaction():
                self.store.script(script)
                self.store.execute("DELETE FROM schema_version")
                self.store.execute("INSERT INTO schema_version (number) VALUES (?)", (number,))
        return self.version()

    def version(self) -> int:
        row = self.store.one("SELECT number FROM schema_version")
        return row["number"] if row else 0
