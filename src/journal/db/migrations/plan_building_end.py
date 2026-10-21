import json
from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration

MATURE_PLAN_STATES = ("ready", "approved", "started", "done")


class PlanBuildingEnd(Migration):
    """A project's Building a plan, edited or not, ends when its plan is ready or later, as the shipped one does."""

    number: ClassVar[int] = 4

    def apply(self, connection: Connection) -> None:
        connection.execute("UPDATE sequences SET end_condition = ? WHERE title = 'Building a plan' AND (end_condition IS NULL OR end_condition = '[]')", (json.dumps(MATURE_PLAN_STATES),))
