import json
from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration

PLAN_READY_OR_LATER = ("ready", "approved", "started", "done")


class GiveBuildingAPlanItsEnd(Migration):
    """A project's Building a plan, edited or not, ends when its plan is ready or later, as the shipped one does."""

    number: ClassVar[int] = 4

    def up(self, connection: Connection) -> None:
        connection.execute("UPDATE sequences SET finishes_in = ? WHERE title = 'Building a plan' AND (finishes_in IS NULL OR finishes_in = '[]')", (json.dumps(PLAN_READY_OR_LATER),))
