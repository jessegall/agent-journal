from events.integrations import GmailCheckDue, GmailReplyApproved
from expects import Answered, Given, Ran, Refused, Unchanged, Wrote, answering
from features.gmail.commands import ProposeReply
from features.gmail.details import GmailDetails
from features.gmail.working import GmailWork
from framework.integrations.base import IntegrationFeature
from framework.integrations.details import SEND
from framework.journal import Journal
from controllers.types import Tickets
from resources.boards import Board
from resources.tickets import Ticket
from resources.types import AgentRow, Notice, Question


PASSWORD = "abcd efgh ijkl mnop"
CHOSEN = {"gmail.key": "GMAIL_KEY", "gmail.fetching": True, "gmail.account": "me@gmail.com", "gmail.search": "label:journal", "gmail.board": 1}
SEEDED = [AgentRow(n=1, title="claude-1"), Board(n=1, title="Mail", data={"stages": ["Doing"]})]
HELLO = b"From: Ana <ana@example.com>\r\nSubject: Hello\r\nMessage-ID: <Hello@example.com>\r\n\r\nHi there\r\n"


class Gmail(GmailWork, IntegrationFeature):
    key_refused = ("AUTHENTICATIONFAILED", "Invalid credentials", "Username and Password not accepted")
    details = GmailDetails
    approved = GmailReplyApproved
    due = GmailCheckDue

    def syncs(self) -> list:
        due = GmailCheckDue(agent=1)
        return [
            Given(due, rows=SEEDED, settings=CHOSEN, secrets=answering({"GMAIL_KEY": PASSWORD}), outside=answering({("mail",): {1: HELLO}}))
                >> Wrote(Ticket(title='<untrusted source="gmail" author="Ana">Hello</untrusted>', data={"source": "gmail", "source_id": "1", "board": 1, "gmail_from": "ana@example.com", "gmail_id": "<Hello@example.com>"})) & Ran(("login", "imap.gmail.com", "me@gmail.com")) & Ran(("search", '"label:journal"')),
            Given(due, rows=SEEDED, settings={**CHOSEN, "gmail.search": ""}, secrets=answering({"GMAIL_KEY": PASSWORD}), outside=answering({("login",): ""})) >> Unchanged(),
            Given(due, rows=SEEDED, settings={**CHOSEN, "gmail.fetching": False}, secrets=answering({"GMAIL_KEY": PASSWORD}), outside=answering({("login",): ""})) >> Unchanged(),
            Given(due, rows=[*SEEDED, Ticket(n=1, title="Hello", data={"source": "gmail", "source_id": "1", "board": 1, "stage": "Doing"})], settings=CHOSEN, secrets=answering({"GMAIL_KEY": PASSWORD}), outside=answering({("mail",): {1: HELLO}}))
                >> Ran(("search", '"label:journal"')) & Unchanged(),
            Given(due, rows=SEEDED, settings=CHOSEN, secrets=answering({"GMAIL_KEY": PASSWORD}), outside=answering({("mail",): {}, ("login",): "AUTHENTICATIONFAILED"}))
                >> Wrote(Notice(title="Gmail refused the app password")),
            Given(due, rows=SEEDED, settings=CHOSEN, secrets=answering({"GMAIL_KEY": PASSWORD}), outside=answering({("mail",): {}, ("login",): "no route to host"}))
                >> Wrote(Notice(title="Gmail could not be reached")),
        ]

    def register(self, journal: Journal) -> None:
        super().register(journal)
        journal.commands.add("ticket", ProposeReply(), expects=[
            Given((Tickets, 1, "Thanks, it is fixed."), rows=[Ticket(n=1, title="Crash report", data={"source": "gmail", "gmail_from": "ana@example.com"})])
                >> Wrote(Question(title="Send this answer to ana@example.com for ticket 1", brief="Thanks, it is fixed.")) & Answered(f"asked you whether to send it; nothing is sent until you press {SEND}"),
            Given((Tickets, 1, "Thanks, it is fixed."), rows=[Ticket(n=1, title="Crash report", data={"source": "linear"})]) >> Refused("ticket:1 did not come from Gmail"),
            Given((Tickets, 1, "Thanks, it is fixed."), rows=[Ticket(n=1, title="Crash report", data={"source": "gmail"})]) >> Refused("ticket:1 did not come from Gmail"),
        ])
