from journal.events.listener import Listener
from journal.events.models.created import Created
from journal.models.report import Report
from journal.support.actor_kind import ActorKind
from journal.support.cards import Cards
from journal.support.docking import Docking
from journal.support.scope import Scope


class ReportCard(Listener[Created]):
    """A report an agent writes is a mark in its environment's chat, docked above it until the user opens or closes it."""

    def __init__(self, cards: Cards, docking: Docking, scope: Scope) -> None:
        self.cards, self.docking, self.scope = cards, docking, scope

    def handle(self, event: Created) -> None:
        report = event.model
        if not isinstance(report, Report) or event.actor.kind != ActorKind.AGENT:
            return
        with self.scope.environment(report.environment_id):
            self.docking.pin(self.cards.creation_card(report.environment_id, report, event.actor), report, event.actor)
