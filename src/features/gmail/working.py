from features.gmail.mail import Mailbox
from features.gmail.sync import Choices, synced
from framework.integrations.state import IntegrationState, read_state, write_state
from controllers.types import Secrets
from resources.base import SYSTEM


class GmailWork:
    """What the Gmail feature does, kept out of the feature itself: choosing, reading and answering."""

    unkeyed = "no app password is set"

    def choices(self, record) -> Choices:
        values = self.values(record)
        return Choices(str(values.account).strip(), str(values.search).strip(), int(values.board))

    def service(self, record) -> Mailbox:
        password = Secrets(record, actor=SYSTEM).value_of(str(self.values(record).key))
        return Mailbox(self.choices(record).account, password)

    def deliver(self, mailbox: Mailbox, ticket, text: str) -> None:
        asked = ticket.data.get("gmail_subject", "")
        subject = asked if asked.lower().startswith("re:") else f"Re: {asked}"
        mailbox.sent(ticket.data.get("gmail_from", ""), subject, text, ticket.data.get("gmail_id", ""))

    def missing(self, record) -> str:
        """What keeps a sync from reaching Gmail, in the words the user would act on, or nothing when it can."""
        if not str(self.values(record).key):
            return self.unkeyed
        if not self.choices(record).chosen():
            return "the address, search and board are not all picked"
        return "" if self.values(record).fetching else "fetching is switched off"

    def check(self, record) -> IntegrationState:
        """One sync now, unless something it needs is missing; failures are noticed once until a sync works again."""
        before = read_state(record.root, self.name)
        if self.missing(record):
            return before
        write_state(record.root, self.name, synced(record, self.service(record), self.choices(record), before))
        after = read_state(record.root, self.name)
        self.notice_failure(record, before, after)
        return after
