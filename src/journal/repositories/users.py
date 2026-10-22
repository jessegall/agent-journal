from journal.models.user import User
from journal.support.missing_row import MissingRow
from journal.repositories.repository import Repository


class Users(Repository[User]):
    model = User

    def email_match(self, email: str) -> User:
        rows = self.matching(email=email)
        if not rows:
            raise MissingRow(self.table, email)
        return rows[0]
