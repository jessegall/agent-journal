from queue import Empty, SimpleQueue

from engine.database.database import Database
from engine.database.write_turns import WriteTurns
from engine.journal.journal_home import JournalHome


class DatabasePool:
    """Open connections a server keeps for its requests, each used by one request at a time, so a request never
    opens and sets up a connection of its own: opening one runs its settings and checks the database file's path.
    A connection is made the first time this many requests run at once, and kept for the next."""

    def __init__(self, home: JournalHome, turns: WriteTurns | None = None) -> None:
        self.home, self.turns = home, turns
        self.free: SimpleQueue[Database] = SimpleQueue()

    def taken(self) -> Database:
        try:
            return self.free.get_nowait()
        except Empty:
            return Database.shared(self.home, self.turns)

    def returned(self, database: Database) -> None:
        database.reset_request_state()
        self.free.put(database)
