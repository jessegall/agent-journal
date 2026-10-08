import email
import email.policy
import imaplib
import re
import smtplib
import ssl
from dataclasses import dataclass
from email.message import EmailMessage
from email.utils import parseaddr

from features.secrets.running import Masker
from resources.base import Refused

IMAP_HOST, SMTP_HOST = "imap.gmail.com", "smtp.gmail.com"
ALL_MAIL = '"[Gmail]/All Mail"'
TIMEOUT = 20.0
PER_SYNC = 50
TAGS = re.compile(r"<[^>]+>")


@dataclass(frozen=True)
class Mail:
    """One email as read: who sent it, what it says, and the ids that tie an answer to it."""

    uid: str
    message_id: str
    sender: str
    address: str
    subject: str
    body: str


def quoted(text: str) -> str:
    return '"' + text.replace("\\", "\\\\").replace('"', '\\"') + '"'


def body_of(message: EmailMessage) -> str:
    part = message.get_body(preferencelist=("plain", "html"))
    text = part.get_content() if part else ""
    return TAGS.sub("", text) if part and part.get_content_type() == "text/html" else text


def mail_of(uid: str, raw: bytes) -> Mail:
    message = email.message_from_bytes(raw, policy=email.policy.default)
    name, address = parseaddr(str(message.get("From", "")))
    return Mail(uid, str(message.get("Message-ID", "")), name or address, address, str(message.get("Subject", "")), body_of(message))


class Mailbox:
    """Reads and answers mail from the journal's own process: the app password goes only to Google's mail servers, never to a command line or an error."""

    def __init__(self, account: str, password: str, imap=imaplib.IMAP4_SSL, smtp=smtplib.SMTP_SSL):
        self.account, self.password, self.imap, self.smtp = account, password, imap, smtp
        self.masker = Masker({password: "app password"} if password else {})

    def check(self) -> None:
        if not self.account or not self.password:
            raise Refused("no address and app password are picked, so nothing is read")

    def fetched(self, search: str, after: int) -> tuple[Mail, ...]:
        """The mail matching a Gmail search that is newer than the last uid seen: the oldest first, at most fifty, or the newest fifty the first time."""
        self.check()
        try:
            connection = self.imap(IMAP_HOST, timeout=TIMEOUT)
            try:
                connection.login(self.account, self.password)
                connection.select(ALL_MAIL, readonly=True)
                found = connection.uid("SEARCH", "X-GM-RAW", quoted(search))[1][0].split()
                uids = [int(one) for one in found if int(one) > after]
                chosen = uids[:PER_SYNC] if after else uids[-PER_SYNC:]
                return tuple(mail_of(str(uid), self.raw(connection, uid)) for uid in chosen)
            finally:
                connection.logout()
        except (imaplib.IMAP4.error, OSError, ssl.SSLError) as error:
            raise Refused(self.masker.masked_text(f"{IMAP_HOST} refused: {error}")) from None

    def raw(self, connection, uid: int) -> bytes:
        return connection.uid("FETCH", str(uid), "(BODY.PEEK[])")[1][0][1]

    def sent(self, to: str, subject: str, text: str, reply_to: str) -> None:
        """Sends one message to one address; the text is exactly what was approved."""
        self.check()
        message = EmailMessage()
        message["From"], message["To"], message["Subject"] = self.account, to, subject
        if reply_to:
            message["In-Reply-To"] = message["References"] = reply_to
        message.set_content(text)
        try:
            with self.smtp(SMTP_HOST, timeout=TIMEOUT) as connection:
                connection.login(self.account, self.password)
                connection.send_message(message)
        except (smtplib.SMTPException, OSError) as error:
            raise Refused(self.masker.masked_text(f"{SMTP_HOST} refused: {error}")) from None
