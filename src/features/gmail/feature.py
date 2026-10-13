from events.integrations import GmailCheckDue, GmailReplyApproved
from expects import Answered, Given, Refused, Wrote
from features.gmail.commands import ProposeReply
from features.gmail.details import GmailDetails
from features.gmail.working import GmailWork
from framework.integrations.base import IntegrationFeature
from framework.integrations.details import SEND
from framework.journal import Journal
from controllers.types import Tickets
from resources.tickets import Ticket
from resources.types import Question


class Gmail(GmailWork, IntegrationFeature):
    key_refused = ("AUTHENTICATIONFAILED", "Invalid credentials", "Username and Password not accepted")
    details = GmailDetails
    approved = GmailReplyApproved
    due = GmailCheckDue

    def register(self, journal: Journal) -> None:
        super().register(journal)
        journal.commands.add("ticket", ProposeReply(), expects=[
            Given((Tickets, 1, "Thanks, it is fixed."), rows=[Ticket(n=1, title="Crash report", data={"source": "gmail", "gmail_from": "ana@example.com"})])
                >> Wrote(Question(title="Send this answer to ana@example.com for ticket 1", brief="Thanks, it is fixed.")) & Answered(f"asked you whether to send it; nothing is sent until you press {SEND}"),
            Given((Tickets, 1, "Thanks, it is fixed."), rows=[Ticket(n=1, title="Crash report", data={"source": "linear"})]) >> Refused("ticket:1 did not come from Gmail"),
            Given((Tickets, 1, "Thanks, it is fixed."), rows=[Ticket(n=1, title="Crash report", data={"source": "gmail"})]) >> Refused("ticket:1 did not come from Gmail"),
        ])
