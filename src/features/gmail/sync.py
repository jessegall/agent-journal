import time
from dataclasses import dataclass, replace

from features.integrations.state import IntegrationState
from features.integrations.words import BODY, TITLE, cleaned
from features.gmail.mail import Mail, Mailbox
from features.members.words import words_from
from features.tickets.controller import Tickets
from resources.base import Refused, SYSTEM

SOURCE = "gmail"


@dataclass(frozen=True)
class Choices:
    """What you chose on the card: the address, the search whose mail comes in, and the board it lands on."""

    account: str = ""
    search: str = ""
    board: int = 0

    def chosen(self) -> bool:
        return bool(self.account and self.search and self.board)


def last_uid(cursor: str) -> int:
    return int(cursor) if cursor else 0


def save_mail(tickets: Tickets, board: int, mail: Mail):
    """One ticket for each email: its words wrapped as untrusted and the ids an answer needs kept beside them."""
    title = cleaned((mail.subject or "(no subject)").replace(":", " -"), TITLE)
    brief = cleaned(f"From {mail.sender} <{mail.address}>\n\n{mail.body}", BODY)
    with words_from(SOURCE, cleaned(mail.sender, TITLE)):
        return tickets.create(title, brief=brief, source=SOURCE, source_id=mail.uid, board=board, gmail_from=mail.address, gmail_id=mail.message_id)


def synced(record, mailbox: Mailbox, choices: Choices, state: IntegrationState, now: float | None = None) -> IntegrationState:
    """One sync: the mail that matches and is newer than the last one becomes tickets, then the cursor moves; a sync that fails leaves it where it was."""
    now = time.time() if now is None else now
    tickets, seen = Tickets(record, actor=SYSTEM), last_uid(state.cursor)
    try:
        mails = mailbox.fetched(choices.search, seen)
        known = {t.source_id for t in tickets.rows.standing() if t.source == SOURCE}
        for mail in (one for one in mails if one.uid not in known):
            save_mail(tickets, choices.board, mail)
    except Refused as error:
        return replace(state, last_checked=now, last_error=str(error), failures=state.failures + 1)
    newest = max((int(mail.uid) for mail in mails), default=seen)
    return replace(state, last_checked=now, last_error="", cursor=str(newest), failures=0)
