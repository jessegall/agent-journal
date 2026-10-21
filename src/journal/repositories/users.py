from journal.models.user import User
from journal.support.not_found import NotFound
from journal.repositories.repository import Repository


class Users(Repository[User]):
    model = User

    def by_email(self, email: str) -> User:
        found = self.matching(email=email)
        if not found:
            raise NotFound(self.table, email)
        return found[0]
