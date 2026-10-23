from journal.chat.moment_cards import MomentCards
from journal.models.model import Model
from journal.models.support.ref import Ref
from journal.repositories.links import Links
from journal.repositories.outgoing_changes import OutgoingChanges
from journal.repositories.scope import PROJECT
from journal.repositories.shared_tables import SharedTables
from journal.support.actor import Actor
from journal.support.card_kind import CardKind
from sync_server.rejected_field import RejectedField

DETAIL_CHARACTERS = 120


class RejectedEdits:
    """The edits the team server rejected, put right on this machine: a field takes the value that stands, unless this machine has edited it again since, and a row deleted meanwhile is deleted here too; a card in the chat of the row's environment says whose edit was kept."""

    def __init__(self, tables: SharedTables, outgoing: OutgoingChanges, links: Links, cards: MomentCards) -> None:
        self.tables, self.outgoing, self.links, self.cards = tables, outgoing, links, cards

    def apply(self, rejections: tuple[RejectedField, ...]) -> None:
        for rejection in rejections:
            if self.tables.has(rejection.row_table):
                self.applied(rejection)

    def applied(self, rejection: RejectedField) -> None:
        if rejection.is_deleted_row():
            self.deleted(rejection)
        elif rejection.field not in self.outgoing.queued_fields(rejection.row_table, rejection.row):
            for row in self.tables.rows(rejection.row_table).pulled_update(rejection.row, {rejection.field: rejection.value}, Actor.system()):
                self.cards.show(self.environment(row), None, f"{rejection.writer}'s edit of {row.noun()} {row.row_id}'s {rejection.field} was kept over yours", "warn", detail=f"kept: {str(rejection.value)[:DETAIL_CHARACTERS]}", row=Ref.build(row), shows=CardKind.CONFLICTS)

    def deleted(self, rejection: RejectedField) -> None:
        self.outgoing.dropped(rejection.row_table, rejection.row, Actor.system())
        for row in self.tables.rows(rejection.row_table).pulled_deletion(rejection.row, Actor.system()):
            self.links.remove_links(row, Actor.system())
            self.cards.show(self.environment(row), None, f"{row.noun().capitalize()} {row.row_id} was deleted by a colleague, so your edit of it was dropped", "warn", shows=CardKind.CONFLICTS)

    @staticmethod
    def environment(row: Model) -> int:
        return getattr(row, "environment_id", PROJECT)
