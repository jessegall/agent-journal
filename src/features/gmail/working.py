from dataclasses import asdict, replace

from controllers.types import Questions
from engine import bus
from features.gmail.details import SEND
from features.gmail.mail import Mailbox
from features.gmail.sync import Choices, synced
from features.integrations.state import IntegrationState, read_state, write_state
from features.routing import Reply, Request, handles
from features.secrets.values import ValuesFile
from features.tickets.controller import Tickets
from resources.base import Refused, SYSTEM, USER



class GmailWork:
    """What the Gmail feature does, kept out of the feature itself: choosing, reading, answering and the route the card calls."""

    def choices(self, record) -> Choices:
        values = self.values(record)
        return Choices(str(values.account).strip(), str(values.search).strip(), int(values.board))

    def mailbox(self, record) -> Mailbox:
        password = ValuesFile(record.root).values().get(str(self.values(record).key), "")
        return Mailbox(self.choices(record).account, password)

    def send_approved(self, record, n: int) -> None:
        question = Questions(record, actor=SYSTEM).load(n)
        if not question.data.get("gmail_reply") or question.outcome != SEND or question.data.get("answered_by") != USER:
            return
        ticket = Tickets(record, actor=SYSTEM).load(question.refs[0].split(":")[1])
        asked = ticket.data.get("gmail_subject", "")
        subject = asked if asked.lower().startswith("re:") else f"Re: {asked}"
        bus.defer(lambda: self.push(record, lambda box: box.sent(ticket.data.get("gmail_from", ""), subject, question.brief, ticket.data.get("gmail_id", ""))))

    def push(self, record, sending) -> None:
        """Sends one message from the journal's own process; a failure is kept in the integration's state, never raised into the answer."""
        try:
            sending(self.mailbox(record))
        except Refused as error:
            write_state(record.root, self.name, replace(read_state(record.root, self.name), last_error=str(error)))

    def check(self, record) -> IntegrationState:
        """One sync now: nothing unless the address, a search, a board, a password and the fetching switch are all there; failures are noticed once until a sync works again."""
        before = read_state(record.root, self.name)
        choices = self.choices(record)
        if not str(self.values(record).key) or not choices.chosen() or not self.values(record).fetching:
            return before
        write_state(record.root, self.name, synced(record, self.mailbox(record), choices, before))
        after = read_state(record.root, self.name)
        self.notice_failure(record, before, after)
        return after

    def check_route(self):
        @handles("POST", "/api/{env}/integration/gmail/check")
        def post_check(req: Request) -> Reply:
            return Reply(200, asdict(self.check(req.record())))

        return post_check
