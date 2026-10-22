from journal.repositories.links import Links
from journal.repositories.outgoing_changes import OutgoingChanges
from journal.repositories.shared_tables import SharedTables
from journal.sync.team_change import TeamChange


class IncomingChanges:
    """Writes the changes the team server passes on into this journal, each through its table's repository, so no listener that acts on a local write runs. A column this machine does not know yet is left out, and a field this machine's own queue still holds is kept as this machine has it."""

    def __init__(self, tables: SharedTables, outgoing: OutgoingChanges, links: Links) -> None:
        self.tables, self.outgoing, self.links = tables, outgoing, links

    def apply(self, changes: list[TeamChange]) -> None:
        for change in changes:
            if self.tables.has(change.row_table):
                self.applied(change)

    def applied(self, change: TeamChange) -> None:
        if change.is_deletion():
            self.deleted(change)
        elif change.is_creation():
            self.tables.rows(change.row_table).pulled_creation(change.row, self.unqueued(change), change.actor())
        else:
            self.tables.rows(change.row_table).pulled_update(change.row, self.unqueued(change), change.actor())

    def unqueued(self, change: TeamChange) -> dict:
        return change.fields_without(self.outgoing.queued_fields(change.row_table, change.row))

    def deleted(self, change: TeamChange) -> None:
        self.outgoing.dropped(change.row_table, change.row, change.actor())
        for row in self.tables.rows(change.row_table).pulled_deletion(change.row, change.actor()):
            self.links.remove_links(row, change.actor())
