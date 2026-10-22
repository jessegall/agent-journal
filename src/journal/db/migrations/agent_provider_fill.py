from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration
from journal.providers.providers import Providers


class AgentProviderFill(Migration):
    """Every agent row names its program: one an older journal saved with none runs the default program, as every reader of it took it to."""

    number: ClassVar[int] = 28

    def apply(self, connection: Connection) -> None:
        connection.execute("UPDATE agents SET provider = ? WHERE provider = '' OR provider IS NULL", (Providers().default().name,))
