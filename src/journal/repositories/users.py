from journal.models.user import User
from journal.repositories.repository import Repository


class Users(Repository[User]):
    model = User

    def by_email(self, email: str) -> User: ...
