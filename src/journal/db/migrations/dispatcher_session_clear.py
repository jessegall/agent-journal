from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration


class DispatcherSessionClear(Migration):
    """A worker whose report saved a dispatcher's session as its own, from the session variable its shell inherited, keeps no session, so that dispatcher is never taken for the worker: a session that dispatched workers is never a worker's own."""

    number: ClassVar[int] = 31

    def apply(self, connection: Connection) -> None:
        connection.execute("UPDATE workers SET session = '' WHERE session != '' AND session IN (SELECT dispatcher FROM workers)")
