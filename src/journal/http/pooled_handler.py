from http.server import BaseHTTPRequestHandler

from journal.db.connection import Connection


class PooledHandler(BaseHTTPRequestHandler):
    """An exchange on a thread of its own that may read the database: once the response is written, the thread's connection goes back to the pool before the thread ends."""

    database: Connection

    def finish(self) -> None:
        try:
            super().finish()
        finally:
            self.database.release()
