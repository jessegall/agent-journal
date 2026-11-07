import sqlite3
from dataclasses import dataclass, field

from core.base.database.database import Database


@dataclass(frozen=True)
class RegistryVersion:
    database_id: str | sqlite3.Connection
    fingerprint: str
    synced_at: str
    database: Database = field(compare=False, repr=False)
