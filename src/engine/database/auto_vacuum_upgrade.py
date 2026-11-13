import time
from collections.abc import Callable

from engine.database.database import Database


class AutoVacuumUpgrade:
    """On an update, turns on incremental auto vacuum for a journal database made before it and vacuums it once,
    telling how long that took; a database that has it already is left alone."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def run(self, inform: Callable[[str], None]) -> None:
        started = time.monotonic()
        if self.database.turn_on_auto_vacuum():
            inform(f"turned on incremental auto vacuum and vacuumed the database once in {time.monotonic() - started:.1f} seconds")
