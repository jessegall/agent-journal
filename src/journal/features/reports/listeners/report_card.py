from journal.chat.row_process_card import RowProcessCard
from journal.events.listener import Listener
from journal.events.models.created import Created
from journal.models.report import Report
from journal.support.actor_kind import ActorKind


class ReportCard(Listener[Created]):
    """A report an agent writes is a card in its environment's chat; DockNewWriting docks it above the chat."""

    def __init__(self, card: RowProcessCard) -> None:
        self.card = card

    def handle(self, event: Created) -> None:
        report = event.model
        if isinstance(report, Report) and event.actor.kind == ActorKind.AGENT:
            self.card.show(report.environment_id, report, event.actor)
