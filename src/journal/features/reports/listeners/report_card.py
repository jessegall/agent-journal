from journal.events.listener import Listener
from journal.events.models.created import Created
from journal.models.report import Report
from journal.support.actor_kind import ActorKind
from journal.chat.row_process_card import RowProcessCard
from journal.chat.docking import Docking
from journal.repositories.scope import Scope


class ReportCard(Listener[Created]):
    """A report an agent writes is a mark in its environment's chat, docked above it until the user opens or closes it."""

    def __init__(self, card: RowProcessCard, docking: Docking, scope: Scope) -> None:
        self.card, self.docking, self.scope = card, docking, scope

    def handle(self, event: Created) -> None:
        report = event.model
        if not isinstance(report, Report) or event.actor.kind != ActorKind.AGENT:
            return
        with self.scope.environment(report.environment_id):
            self.docking.pin(self.card.show(report.environment_id, report, event.actor), report, event.actor)
