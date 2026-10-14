from events import Fact
from events.integrations import LinearStageMoved
from events.tickets import TicketUpdated
from receiving import Listener
from resources.tickets import Ticket
from serving import ReadRows


class SpotMovedIssue(Listener[TicketUpdated]):
    """A ticket from Linear whose stage its issue has not been told about; what the sync changed is never sent back."""

    def listen(self, event: TicketUpdated, tickets: ReadRows[Ticket]) -> list[Fact]:
        ticket = tickets.peek(event.n)
        if ticket.source != "linear" or ticket.data.get("linear_stage") == ticket.stage:
            return []
        return [LinearStageMoved(ticket=ticket.n)]
