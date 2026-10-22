import hashlib
import secrets

from sync_server.account import MEMBER, Account
from sync_server.accounts import Accounts
from sync_server.db.invitation_rows import InvitationRows
from sync_server.db.store import Store
from sync_server.refusal import Refusal

VALID_SECONDS = 7 * 24 * 3600


class Invitations:
    """The codes an admin hands out to bring a person onto the team: each for one email, used once, and gone after a week; a code turns into the person's account with the password they typed twice."""

    def __init__(self, store: Store, rows: InvitationRows, accounts: Accounts) -> None:
        self.store, self.rows, self.accounts = store, rows, accounts

    def issue(self, email: str, created_at: float) -> tuple[str, float]:
        code = secrets.token_urlsafe(12)
        self.rows.insert(self.code_hash(code), email.lower(), created_at, created_at + VALID_SECONDS)
        return code, created_at + VALID_SECONDS

    def accept(self, code: str, name: str, password: str, password_repeat: str, accepted_at: float) -> Account:
        if password != password_repeat:
            raise Refusal("the two passwords differ: type the same password twice")
        with self.store.transaction():
            invitation = self.rows.with_code_hash(self.code_hash(code))
            if invitation is None or invitation["used_at"]:
                raise Refusal("this invitation code is not known or was used already: ask the admin for a new one")
            if invitation["expires_at"] < accepted_at:
                raise Refusal("this invitation code expired: ask the admin for a new one")
            account = self.accounts.create(invitation["email"], name, password, MEMBER, accepted_at)
            self.rows.use(invitation["id"], accepted_at)
            return account

    @staticmethod
    def code_hash(code: str) -> str:
        return hashlib.sha256(code.encode()).hexdigest()
