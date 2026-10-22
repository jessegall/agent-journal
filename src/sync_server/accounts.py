from sync_server.account import Account
from sync_server.db.account_rows import AccountRows
from sync_server.password import Password
from sync_server.refusal import Refusal

MINIMUM_PASSWORD_CHARACTERS = 10


class Accounts:
    """The team's people, each with a password kept only as a hash."""

    def __init__(self, rows: AccountRows) -> None:
        self.rows = rows

    def create(self, email: str, name: str, password: str, role: str, created_at: float) -> Account:
        if len(password) < MINIMUM_PASSWORD_CHARACTERS:
            raise Refusal(f"a password has at least {MINIMUM_PASSWORD_CHARACTERS} characters")
        if self.rows.with_email(email.lower()):
            raise Refusal(f"{email} already has an account")
        return self.find(self.rows.insert(email.lower(), name, role, Password.hashed(password), created_at))

    def find(self, id: int) -> Account:
        row = self.rows.numbered(id)
        if row is None:
            raise Refusal(f"no account {id}")
        return Account(row["id"], row["email"], row["name"], row["role"])

    def verified(self, email: str, password: str) -> Account:
        row = self.rows.with_email(email.lower())
        if row is None or row["removed_at"] or not Password.matches(password, row["password_hash"]):
            raise Refusal("the email or the password is wrong")
        return self.find(row["id"])

    def is_empty(self) -> bool:
        return self.rows.count() == 0

    def remove(self, id: int, removed_at: float) -> Account:
        account = self.find(id)
        self.rows.remove(id, removed_at)
        return account

    def is_removed(self, id: int) -> bool:
        row = self.rows.numbered(id)
        return row is None or bool(row["removed_at"])

    def has_email(self, email: str) -> bool:
        return self.rows.with_email(email.lower()) is not None
