from features.gmail.mail import Mailbox
from features.gmail.sync import Choices, synced
from features.integrations.state import IntegrationState, read_state, write_state
from features.secrets.values import ValuesFile


class GmailWork:
    """What the Gmail feature does, kept out of the feature itself: choosing, reading and answering."""

    def choices(self, record) -> Choices:
        values = self.values(record)
        return Choices(str(values.account).strip(), str(values.search).strip(), int(values.board))

    def service(self, record) -> Mailbox:
        password = ValuesFile(record.root).values().get(str(self.values(record).key), "")
        return Mailbox(self.choices(record).account, password)

    def deliver(self, mailbox: Mailbox, ticket, text: str) -> None:
        asked = ticket.data.get("gmail_subject", "")
        subject = asked if asked.lower().startswith("re:") else f"Re: {asked}"
        mailbox.sent(ticket.data.get("gmail_from", ""), subject, text, ticket.data.get("gmail_id", ""))

    def check(self, record) -> IntegrationState:
        """One sync now: nothing unless the address, a search, a board, a password and the fetching switch are all there; failures are noticed once until a sync works again."""
        before = read_state(record.root, self.name)
        choices = self.choices(record)
        if not str(self.values(record).key) or not choices.chosen() or not self.values(record).fetching:
            return before
        write_state(record.root, self.name, synced(record, self.service(record), choices, before))
        after = read_state(record.root, self.name)
        self.notice_failure(record, before, after)
        return after
