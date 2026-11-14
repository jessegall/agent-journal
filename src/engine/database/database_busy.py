import sqlite3

PRIMARY_ERROR_CODE_MASK = 0xFF
BUSY_ERROR_CODES = frozenset({sqlite3.SQLITE_BUSY, sqlite3.SQLITE_LOCKED})


class DatabaseBusy:
    """Says whether a database error means another writer holds the database, which a later try may get past."""

    @staticmethod
    def is_busy(error: BaseException) -> bool:
        return isinstance(error, sqlite3.OperationalError) and error.sqlite_errorcode & PRIMARY_ERROR_CODE_MASK in BUSY_ERROR_CODES
