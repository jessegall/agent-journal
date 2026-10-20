import json
from typing import ClassVar

from journal.db.connection import Connection
from journal.db.migration import Migration


class PlaceWorkflowsPerEvent(Migration):
    """A workflow held one place for every event it answered; it now holds one per event it has a trigger for and at the event it was made for, each starting at the place it had."""

    number: ClassVar[int] = 16

    def up(self, connection: Connection) -> None:
        if "place" not in {column["name"] for column in connection.all("PRAGMA table_info(charts)")}:
            return
        for chart in connection.all("SELECT id, event, place FROM charts"):
            triggers = connection.all("SELECT nodes.key FROM nodes JOIN links ON links.source = 'nodes:' || nodes.id WHERE links.target = ? AND links.kind = 'node_of' AND nodes.kind = 'trigger'", (f"charts:{chart['id']}",))
            events = {row["key"] for row in triggers} | ({chart["event"]} if chart["event"] else set())
            connection.execute("UPDATE charts SET places = ? WHERE id = ?", (json.dumps({event: chart["place"] for event in events}), chart["id"]))
